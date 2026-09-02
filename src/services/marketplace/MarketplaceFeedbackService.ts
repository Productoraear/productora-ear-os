export const marketplaceFeedback = {
  track: (event: string, meta?: any) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[FEEDBACK TRACK] ${event}`, meta);
    }
  }
};

export default marketplaceFeedback;
