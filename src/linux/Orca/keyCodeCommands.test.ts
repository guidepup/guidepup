import { keyCodeCommands } from "./keyCodeCommands";

jest.mock("./serviceDefinition", () => ({
  serviceDefinition: {
    modules: {
      "test-service-1": {
        objectPath: "test-object-path-1",
        commands: {
          "test-command-1": {
            description: "test-description-1",
            representation: "test-representation-1",
          },
          "test-command-without-representation": {
            description: "test-description",
          },
        },
      },
      "test-service-2": {
        objectPath: "test-object-path-2",
        commands: {
          "test-command-1": {
            description: "test-description-1-service-2",
            representation: "test-representation-1-service-2",
          },
          "test-command-2": {
            description: "test-description-2",
            representation: "test-representation-2",
          },
        },
      },
    },
  },
}));

describe("keyCodeCommands", () => {
  it("should include every command that has a keyboard representation, with its service", () => {
    expect(keyCodeCommands).toEqual({
      "test-service-1": {
        "test-command-1": {
          command: "test-command-1",
          description: "test-description-1",
          representation: "test-representation-1",
          service: "test-service-1",
        },
      },
      "test-service-2": {
        "test-command-1": {
          command: "test-command-1",
          description: "test-description-1-service-2",
          representation: "test-representation-1-service-2",
          service: "test-service-2",
        },
        "test-command-2": {
          command: "test-command-2",
          description: "test-description-2",
          representation: "test-representation-2",
          service: "test-service-2",
        },
      },
    });
  });
});
