import type { CommandOptions } from "../../CommandOptions";
import type { DBusPromise } from "dbus-native";
import type { serviceDefinition } from "./serviceDefinition";

type OrcaTypeMap = {
  str: string;
  bool: boolean;
};

type ParameterValue<P> = P extends { type: infer T extends keyof OrcaTypeMap }
  ? OrcaTypeMap[T]
  : never;

type ParameterTuple<P extends readonly { type: keyof OrcaTypeMap }[]> = {
  [K in keyof P]: ParameterValue<P[K]>;
};

type DBusCommand<
  Definition extends {
    description: string;
    representation?: string;
  },
> = Definition & {
  execute(notifyUser?: boolean): DBusPromise<void>;
};

type DBusParameterizedCommand<
  Definition extends {
    description: string;
    representation?: string;
  },
  Parameters extends readonly { type: keyof OrcaTypeMap }[],
> = Definition & {
  execute(...parameters: ParameterTuple<Parameters>): DBusPromise<unknown>;
};

type DBusRuntimeGetter<
  Definition extends {
    description: string;
  },
> = Definition & {
  get(): DBusPromise<unknown>;
};

type DBusRuntimeSetter<
  Definition extends {
    description: string;
  },
> = Definition & {
  set(value: unknown): DBusPromise<void>;
};

type OrcaModule<M> = M extends {
  commands: infer C;
  parameterizedCommands: infer PC;
  runtimeGetters: infer RG;
  runtimeSetters: infer RS;
}
  ? {
      commands: {
        [K in keyof C]: C[K] extends {
          description: string;
          representation?: string;
        }
          ? DBusCommand<C[K]>
          : never;
      };

      parameterizedCommands: {
        [K in keyof PC]: PC[K] extends {
          description: string;
          representation?: string;
          parameters: infer P extends readonly {
            type: keyof OrcaTypeMap;
          }[];
        }
          ? DBusParameterizedCommand<PC[K], P>
          : never;
      };

      runtimeGetters: {
        [K in keyof RG]: RG[K] extends {
          description: string;
        }
          ? DBusRuntimeGetter<RG[K]>
          : never;
      };

      runtimeSetters: {
        [K in keyof RS]: RS[K] extends {
          description: string;
        }
          ? DBusRuntimeSetter<RS[K]>
          : never;
      };
    }
  : never;

export type OrcaService = {
  [K in keyof typeof serviceDefinition.modules]: OrcaModule<
    (typeof serviceDefinition.modules)[K]
  >;
};

export type ActionOptions = Pick<CommandOptions, "capture">;

export interface QueueAction {
  action: () => Promise<unknown>;
  options: ActionOptions;
  promise: Promise<unknown>;
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}

export type GuidepupSpeechdMessage =
  | { type: "ready" }
  | { type: "speech"; data: string }
  | { type: "stop" }
  | { type: "pause" }
  | { type: "cancel" };
