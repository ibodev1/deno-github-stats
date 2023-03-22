import { getGithubUser, getTotalCommits, getTotalIssues, getTotalPrs, getTotalStars } from "./lib/github.ts";
import { green, red, yellow } from "fmt/colors.ts";

(async () => {
    const githubUsername = Deno.args[0];
    if (typeof githubUsername !== "undefined" && githubUsername) {
        const githubDetails = await getGithubUser(githubUsername);
        if (githubDetails.status === "success") {
            const totalCommits = await getTotalCommits(githubUsername);
            const totalIssues = await getTotalIssues(githubUsername);
            const totalPrs = await getTotalPrs(githubUsername);
            const totalStars = await getTotalStars(githubUsername);
            const hr = green(`-------------------------------`);
            const statsTemplate = `
                ${hr}
                ${githubDetails?.name ? githubDetails.name + " - " : ""}[${yellow(githubUsername)}]
                - ${green(githubDetails.followers.toString())} Followers
                - ${green(githubDetails.following.toString())} Following
                ${hr}
                - ${totalCommits > 0 ? green(totalCommits.toString()) : red(totalCommits.toString())} Total Commit.
                - ${totalIssues > 0 ? green(totalIssues.toString()) : red(totalIssues.toString())} Total Issues.
                - ${totalPrs > 0 ? green(totalPrs.toString()) : red(totalPrs.toString())} Total Prs.
                - ${totalStars > 0 ? green(totalStars.toString()) : red(totalStars.toString())} Total Stars.
                ${hr}
                -- Rate Limit : ${red(githubDetails.rate.value)} - Reset : ${githubDetails.rate.reset}`;
            console.log(statsTemplate);
        } else {
            console.log(red("Error!"));
            console.log(`-- Rate Limit : ${red(githubDetails.rate.value)} - Reset : ${githubDetails.rate.reset}`);
            console.log(githubDetails);
        }
    } else {
        console.log(red("Input github username."));
    }
})();