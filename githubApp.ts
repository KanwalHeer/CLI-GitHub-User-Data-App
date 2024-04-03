import inquirer from "inquirer";
import chalk from "chalk";

async function main() {
    try {
        const { username } = await inquirer.prompt({
            name: "username",
            type: "input",
            message: "Enter the username:",
            validate: function(input) {
                return input !== "" ? true : "Please enter a username.";
            }
        });

        const response = await fetch(`https://api.github.com/users/${username}`);
        if (!response.ok) {
            throw new Error(chalk.red(`Failed to fetch user data for ${username}: ${response.status}`));
        }
    
        const userData = await response.json();
    
        let exit = false;
        do {
            const answer = await inquirer.prompt([
                {
                    name: "option",
                    type: "list",
                    message: "Choose an option to view:",
                    choices: [
                        "View All Data",
                        "View followers",
                        "View following",
                        "View public repositories",
                        "View created date",
                        "View updated date",
                        "Exit"
                    ]
                }
            ]);
        
            switch (answer.option) {
                case "View All Data":
                    console.log(chalk.yellow(`User Data for ${username}`));
                    console.log(chalk.cyan(`User name:  ${userData.login}`));
                    console.log(chalk.cyan(`User Id: ${userData.id}`));
                    console.log(chalk.cyan(`User followers list:  ${userData.followers}`));
                    console.log(chalk.cyan(`User following list:  ${userData.following}`));
                    console.log(chalk.cyan(`User  public_repos:  ${userData.public_repos}`));
                    console.log(chalk.cyan(`User  created_at:  ${userData.created_at}`));
                    console.log(chalk.cyan(`User  updated_at:  ${userData.updated_at}`));
                    break;
                case "View followers":
                    console.log(chalk.yellow(`User followers:`));
                    await allFollowers(username);
                    break;
                case "View following":
                    console.log(chalk.yellow(`User following:`));
                    await allFollowing(username);
                    break;
                case "View public repositories":
                    console.log(chalk.yellow(`User public repositories: ${userData.public_repos}`));
                    break;
                case "View created date":
                    console.log(chalk.yellow(`User created date: ${userData.created_at}`));
                    break;
                case "View updated date":
                    console.log(chalk.yellow(`User updated date: ${userData.updated_at}`));
                    break;
                case "Exit":
                    exit = true;
                    console.log(chalk.green(`You're exiting! Have a nice day.`));
                    console.log(chalk.yellow(`*****************************`));
                    break;
                default:
                    console.log(chalk.red("Invalid option."));
            }
        } while (!exit);
    } catch (error) {
        console.error(chalk.red("Error:"), error);
    }
}


async function allFollowers(username: any) {
  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/followers`
    );
    if (!response.ok) {
      throw new Error(
        chalk.red(`Failed to fetch followers data: ${response.status}`)
      );
    }

    const followersData = await response.json();
    const followerUsernames = followersData.map(
      (follower: any) => follower.login
    );

    console.log(chalk.yellow(`Usernames of followers of ${username}:`));
    
    // Prompt user for options after fetching followers list
    const { option } = await inquirer.prompt({
      name: "option",
      type: "list",
      message: "Choose an option:",
      choices: ["View All Followers", "View One Follower", "Exit"],
    });

    switch (option) {
      case "View All Followers":
        console.log(chalk.yellow("Viewing all followers:"));
        console.log(chalk.magenta(followerUsernames.join("\n")));
        break;
      case "View One Follower":
        const { followerName } = await inquirer.prompt({
          name: "followerName",
          type: "input",
          message: "Enter the username of the follower:",
          validate: function (input) {
            if (followerUsernames.includes(input)) {
              return true;
            } else {
              return chalk.red(
                "Invalid username. Please enter a valid username."
              );
            }
          },
        });
        await viewFollowerDetails(followerName);
        break;
      case "Exit":
        console.log(chalk.green("Exiting..."));
        break;
      default:
        console.log(chalk.red("Invalid option."));
    }
  } catch (error) {
    console.error(chalk.red("Error fetching followers data:"), error);
  }
}




async function allFollowing(username: any) {
  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/following`
    );
    if (!response.ok) {
      throw new Error(
        chalk.red(`Failed to fetch following data: ${response.status}`)
      );
    }

    const followingData = await response.json();
    const followingUsernames = followingData.map(
      (following: any) => following.login
    );

    console.log(chalk.yellow(`Usernames of users followed by ${username}:`));
   
    // Prompt user for options after fetching following list
    const { option } = await inquirer.prompt({
      name: "option",
      type: "list",
      message: "Choose an option:",
      choices: ["View All Followed Users", "View One Followed User", "Exit"],
    });

    switch (option) {
      case "View All Followed Users":
        console.log(chalk.yellow("Viewing all followed users:"));
        console.log(chalk.magenta(followingUsernames.join("\n")));
        break;
      case "View One Followed User":
        const { followingName } = await inquirer.prompt({
          name: "followingName",
          type: "input",
          message: "Enter the username of the followed user:",
          validate: function (input) {
            if (followingUsernames.includes(input)) {
              return true;
            } else {
              return chalk.red(
                "Invalid username. Please enter a valid username."
              );
            }
          },
        });

        await viewFollowingDetails(followingName);
        break;
      case "Exit":
        console.log(chalk.green("Exiting..."));
        break;
      default:
        console.log(chalk.red("Invalid option."));
    }
  } catch (error) {
    console.error(chalk.red("Error fetching following data:"), error);
  }
}





async function viewFollowerDetails(followerName: any) {
  try {
    const response = await fetch(
      `https://api.github.com/users/${followerName}`
    );
    if (!response.ok) {
      throw new Error(
        chalk.red(
          `Failed to fetch data for follower ${followerName}: ${response.status}`
        )
      );
    }
    const followerDetails = await response.json();

    console.log(chalk.yellow(`Details of follower ${followerName}:`));
    console.log(chalk.magenta(`Name: ${followerDetails.name}`));
    console.log(chalk.magenta(`Username: ${followerDetails.login}`));
    console.log(chalk.magenta(`Followers: ${followerDetails.followers}`));
    console.log(chalk.magenta(`Following: ${followerDetails.following}`));
    console.log(chalk.magenta(`User  public_repos:  ${followerDetails.public_repos}`));
    console.log(
      chalk.magenta(
        `First repository created at: ${followerDetails.created_at}`
      )
    );
    console.log(
      chalk.magenta(`Last repository updated at: ${followerDetails.updated_at}`)
    );
    console.log(
      chalk.yellow("----------------------------------------------------")
    );
  } catch (error) {
    console.error(
      chalk.red(`Error fetching data for follower ${followerName}:`),
      error
    );
  }
}





async function viewFollowingDetails(followingName: any) {
  try {
    const response = await fetch(
      `https://api.github.com/users/${followingName}`
    );
    if (!response.ok) {
      throw new Error(
        chalk.red(
          `Failed to fetch data for user ${followingName}: ${response.status}`
        )
      );
    }
    const followingDetails = await response.json();

    console.log(chalk.yellow(`Details of user ${followingName}:`));
    console.log(chalk.magenta(`Name: ${followingDetails.name}`));
    console.log(chalk.magenta(`Username: ${followingDetails.login}`));
    console.log(chalk.magenta(`Followers: ${followingDetails.followers}`));
    console.log(chalk.magenta(`Following: ${followingDetails.following}`));
    console.log(chalk.magenta(`User  public_repos:  ${followingDetails.public_repos}`));
    console.log(
      chalk.magenta(
        `First repository created at: ${followingDetails.created_at}`
      )
    );
    console.log(
      chalk.magenta(
        `Last repository updated at: ${followingDetails.updated_at}`
      )
    );
    console.log(
      chalk.yellow("----------------------------------------------------")
    );
  } catch (error) {
    console.error(
      chalk.red(`Error fetching data for user ${followingName}:`),
      error
    );
  }
}

main();
