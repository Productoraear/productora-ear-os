// RAG Database for Productora EAR
const earRagDatabase = {
  entities: [
    {
      name: "Entity1",
      description: "Description of Entity1",
      split: {
        artist: 80,
        earOS: 10,
        vimume: 10
      },
      acousticSystem: {
        mainSpeaker: "Bose F1 812",
        microphone: "Shure Beta 87A"
      }
    }
  ]
};
export default earRagDatabase;
