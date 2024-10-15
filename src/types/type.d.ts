declare type bookType = {
    id: string;
    user: userType;
    title: string;
    notes: string;
    time: string;
    cover?: string;
    comments: commentType[];
}

declare type commentType = {
    id: string;
    user: userType;
    comment: string;
    upvote: userType[];
    comments?: commentType[];
}

declare type userType = {
    name: string;
    username: string;
    desc?: string;
    password?: string;
    pp?: string;
    accessToken?: {
      accessNow: string;
      timeBefore: string;
    };
    bookmark?: bookType[];
}
