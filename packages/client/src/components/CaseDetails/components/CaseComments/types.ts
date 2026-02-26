export type CaseCommentsProps = {
  caseData: {
    id: string;
    comments?: Array<{
      id: string;
      content: string;
      createdAt: string;
      updatedAt: string;
      caseId: string;
      authorId: string;
      author: { id: string; firstName: string; lastName: string; email: string };
      upvoteCount: number;
      downvoteCount: number;
      upvoters: string[];
      downvoters: string[];
      userVote: 'none' | 'up' | 'down';
    }>;
  };
};
