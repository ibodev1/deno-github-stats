const timeConverter = (timestamp: number) => {
    const a = new Date(timestamp * 1000);
    const year = a.getFullYear();
    const month = a.getMonth().toString().padStart(2, "0");
    const date = a.getDate().toString().padStart(2, "0");
    const hour = a.getHours().toString().padStart(2, "0");
    const min = a.getMinutes().toString().padStart(2, "0");
    const sec = a.getSeconds().toString().padStart(2, "0");
    const time = date + '/' + month + '/' + year + ' ' + hour + ':' + min + ':' + sec;
    return time;
}
const getGithubUser = async (username: string) => {
    const response = await fetch(`https://api.github.com/users/${username}`);
    const value = response.headers.get("x-ratelimit-remaining") + "/" + response.headers.get("x-ratelimit-limit")
    const ts = Number(response.headers.get("x-ratelimit-reset")) ?? 0;
    const resetTime = timeConverter(ts);
    const user = await response.json()
    if (user.message) {
        return {
            status: "error",
            rate: {
                value: value,
                reset: resetTime
            },
            ...user
        };
    }
    return {
        status: "success",
        name: user.name,
        public_repos: user.public_repos,
        followers: user.followers,
        following: user.following,
        rate: {
            value: value,
            reset: resetTime
        }
    }
}

const getTotalStars = async (username: string) => {
    const repos = await fetch(
        `https://api.github.com/users/${username}/repos?per_page=1000`
    )
        .then((res) => res.json());
    return repos
        .filter((repo: any) => !repo.fork)
        .reduce((acc: any, repo: any) => acc + repo.stargazers_count, 0)
}

const getTotalPrs = async (username: string) => {
    const prs = await fetch(
        `https://api.github.com/search/issues?q=author:${username}+is:pr`
    )
        .then((res) => res.json());
    return prs.total_count;
}

const getTotalIssues = async (username: string) => {
    const issues = await fetch(
        `https://api.github.com/search/issues?q=author:${username}+is:issue`
    )
        .then((res) => res.json());
    return issues.total_count;
}

const getTotalCommits = async (username: string) => {
    const commits = await fetch(
        `https://api.github.com/search/commits?q=author:${username}`
    )
        .then((res) => res.json());
    return commits.total_count;
}

export {
    getGithubUser,
    getTotalCommits,
    getTotalIssues,
    getTotalPrs,
    getTotalStars
}