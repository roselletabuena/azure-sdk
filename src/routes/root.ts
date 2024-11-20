import { FastifyPluginAsync } from "fastify";
import { azureConnection } from "../services/AzureService";

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get("/", async function (request, reply) {
    try {
      const connection = await azureConnection();
      const buildApi = await connection.getBuildApi();

      const project = "AzureDemo";
      const pipelines = await buildApi.getDefinitions(project);

      return { pipelines };
    } catch (error) {
      console.error("Error fetching pipelines:", error);
      reply.status(500).send({ error: "Failed to fetch pipelines" });
    }
  });
};

export default root;
