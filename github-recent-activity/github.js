#!/usr/bin/env node
import { Octokit } from "octokit";
const orgs = process.argv;
<<<<<<< HEAD
const octokit = new Octokit({});
=======
const octokit = new Octokit({
  auth: process.env.GIT_TOKEN,
});
>>>>>>> 5335d93 (added github-recent-activity project)

async function fetchActivityData() {
  try {
    const eventData = await octokit.request(
      "GET /users/{username}/events/public?per_page=10",
      {
        username: orgs[2],
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    const activityData = eventData.data;

    activityData.forEach((item) => {
      if (item.type === "PushEvent") {
        console.log(
          `- Pushed ${item.payload.commits.length} commits to ${item.repo.name}`
        );
      } else if (
        item.type === "IssuesEvent" &&
        item.payload.action === "opened"
      ) {
        console.log(`- Opened a new issue in ${item.repo.name}`);
      } else if (item.type === "CreateEvent") {
        if (item.payload.ref_type === "repository") {
          console.log(`- Created a new repository ${item.repo.name}`);
        } else if (item.payload.ref_type === "branch") {
          console.log(
            `- Created a new branch ${item.payload.ref} in ${item.repo.name}`
          );
        } else if (item.payload.ref_type === "tag") {
          console.log(
            `- Created a new tag ${item.payload.ref} in ${item.repo.name}`
          );
        }
      } else if (item.type === "WatchEvent") {
        console.log(`- Starred ${item.repo.name}`);
      } else if (
        item.type === "IssueCommentEvent" &&
        item.payload.action === "created"
      ) {
        console.log(
          `- Commented on issue #${item.payload.issue.number} in ${item.repo.name}: "${item.payload.comment.body}"`
        );
      } else {
        console.log("- Performed an action");
      }
    });
  } catch (error) {
    console.error("Error fetching activity data:", error);
  }
}

fetchActivityData();
