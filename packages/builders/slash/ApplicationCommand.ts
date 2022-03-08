import { ApplicationCommandTypes, EditGlobalApplicationCommand } from "../dep.ts";
import { mix } from "../mix/mod.ts";
import { OptionBased } from "./SlashCommandOption.ts";

export abstract class ApplicationCommandBuilder implements EditGlobalApplicationCommand {
  protected constructor(
    // required
    public type?: ApplicationCommandTypes,
    public name?: string,
    public description?: string,
    // non-required
    public defaultPermission?: boolean,
  ) {
    this.type = type;
    this.name = name;
    this.description = description;
    this.defaultPermission = defaultPermission;
  }

  public setType(type: ApplicationCommandTypes) {
    return (this.type = type), this;
  }

  public setName(name: string) {
    return (this.name = name), this;
  }

  public setDescription(description: string) {
    return (this.description = description), this;
  }
}

export class MessageApplicationCommandBuilder {
  public constructor(
    // required
    public type?: ApplicationCommandTypes,
    public name?: string,
  ) {
    this.type = ApplicationCommandTypes.Message;
    this.name = name;
  }

  public setName(name: string) {
    return (this.name = name), this;
  }

  public toJSON(): { name: string; type: ApplicationCommandTypes.Message } {
    if (!this.name) throw new TypeError("Propety 'name' is required");

    return {
      type: ApplicationCommandTypes.Message,
      name: this.name,
    };
  }
}

// TODO
// export class UserApplicationCommandBuilder extends ApplicationCommandBuilder {}

@mix(ApplicationCommandBuilder, OptionBased)
export class ChatInputApplicationCommandBuilder {
  public type: ApplicationCommandTypes.ChatInput = ApplicationCommandTypes.ChatInput;

  public toJSON(): EditGlobalApplicationCommand & {
    name: string;
    description: string;
    type: ApplicationCommandTypes.ChatInput;
  } {
    if (!this.type) throw new TypeError("Propety 'type' is required");
    if (!this.name) throw new TypeError("Propety 'name' is required");
    if (!this.description) {
      throw new TypeError("Propety 'description' is required");
    }

    return {
      type: ApplicationCommandTypes.ChatInput,
      name: this.name,
      description: this.description,
      options: this.options?.map((o) => o.toJSON()) ?? [],
      defaultPermission: this.defaultPermission,
    };
  }
}
export interface ChatInputApplicationCommandBuilder extends ApplicationCommandBuilder, OptionBased {
  // pass
}
