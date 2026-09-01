import { serviceDefinition } from "./serviceDefinition";

export type KeyCodeCommandDefinition<
  CommandName extends string,
  Service extends string,
  CommandMeta extends {
    readonly description: string;
    readonly representation: string;
  },
> = {
  readonly command: CommandName;
  readonly description: CommandMeta["description"];
  readonly representation: CommandMeta["representation"];
  readonly service: Service;
};

type KeyCodeCommands<
  Modules extends Record<
    string,
    {
      commands: Record<
        string,
        {
          readonly description: string;
          readonly representation?: string;
        }
      >;
    }
  >,
> = UnionToIntersection<
  {
    [Service in keyof Modules]: {
      [Command in keyof Modules[Service]["commands"] as Modules[Service]["commands"][Command] extends {
        readonly representation: string;
      }
        ? Command
        : never]: Modules[Service]["commands"][Command] extends {
        readonly description: string;
        readonly representation: string;
      }
        ? KeyCodeCommandDefinition<
            Command & string,
            Service & string,
            Modules[Service]["commands"][Command]
          >
        : never;
    };
  }[keyof Modules]
>;

type UnionToIntersection<T> = (
  T extends unknown ? (value: T) => void : never
) extends (value: infer I) => void
  ? I
  : never;

function createKeyCodeCommands<
  Modules extends Record<
    string,
    {
      commands: Record<
        string,
        {
          readonly description: string;
          readonly representation?: string;
        }
      >;
    }
  >,
>(modules: Modules): KeyCodeCommands<Modules> {
  return Object.fromEntries(
    Object.entries(modules).flatMap(([service, module]) =>
      Object.entries(module.commands)
        .filter(([, command]) => command.representation !== undefined)
        .map(([command, definition]) => [
          command,
          {
            description: definition.description,
            representation: definition.representation,
            service,
          },
        ]),
    ),
  ) as KeyCodeCommands<Modules>;
}

export type KeyCodeCommand = KeyCodeCommands<
  typeof serviceDefinition.modules
>[keyof KeyCodeCommands<typeof serviceDefinition.modules>];

export const keyCodeCommands = createKeyCodeCommands(serviceDefinition.modules);
