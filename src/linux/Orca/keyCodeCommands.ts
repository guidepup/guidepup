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
> = {
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
};

// TODO: generate this shape from the Orca D-Bus service at build time, or
// hardcode the structure needed, rather than reshaping the
// `serviceDefinition` fixture at load.
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
    Object.entries(modules).map(([service, module]) => [
      service,
      Object.fromEntries(
        Object.entries(module.commands)
          .filter(([, definition]) => definition.representation !== undefined)
          .map(([command, definition]) => [
            command,
            {
              command,
              description: definition.description,
              representation: definition.representation,
              service,
            },
          ]),
      ),
    ]),
  ) as KeyCodeCommands<Modules>;
}

type KeyCodeCommandUnion<
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
> = {
  [Service in keyof KeyCodeCommands<Modules>]:
    KeyCodeCommands<Modules>[Service][keyof KeyCodeCommands<Modules>[Service]];
}[keyof KeyCodeCommands<Modules>];

export type KeyCodeCommand = KeyCodeCommandUnion<typeof serviceDefinition.modules>;

export const keyCodeCommands = createKeyCodeCommands(serviceDefinition.modules);
