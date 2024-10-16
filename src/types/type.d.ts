declare type bookType = {
    _id: any;
    id: string;
    user: userType;
    title: string;
    notes: string;
    time: string;
    cover?: string;
}

declare type commentType = {
    _id: any;
    id: string;
    user: userType;
    comment: string;
    upvote: userType[];
    commentTo: string;
}

declare type userType = {
    _id: any;
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
