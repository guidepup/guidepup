import { keyCodeCommands } from "./keyCodeCommands";

jest.mock("./serviceDefinition", () => ({
  serviceDefinition: {
    modules: {
      ObjectNavigator: {
        objectPath: "/org/gnome/Orca1/Service/ObjectNavigator",
        commands: {
          MoveToNextSibling: {
            description: "Moves to the next sibling.",
            representation: "ORCA-Ctrl-Right",
          },
          PerformAction: {
            description: "Performs the default action.",
          },
        },
      },
      StructuralNavigator: {
        objectPath: "/org/gnome/Orca1/Service/StructuralNavigator",
        commands: {
          NextHeading: {
            description: "Goes to next heading.",
            representation: "H",
          },
        },
      },
    },
  },
}));

describe("keyCodeCommands", () => {
  it("should include every command that has a keyboard representation, with its service", () => {
    expect(keyCodeCommands).toEqual({
      MoveToNextSibling: {
        command: "MoveToNextSibling",
        description: "Moves to the next sibling.",
        representation: "ORCA-Ctrl-Right",
        service: "ObjectNavigator",
      },
      NextHeading: {
        command: "NextHeading",
        description: "Goes to next heading.",
        representation: "H",
        service: "StructuralNavigator",
      },
    });
  });
});
