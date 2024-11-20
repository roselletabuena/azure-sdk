import { FastifyPluginAsync } from "fastify";
import { azureConnection } from "../services/AzureService";
import {
  BuildDefinition,
  DefinitionType,
  YamlProcess,
} from "azure-devops-node-api/interfaces/BuildInterfaces";

const root: FastifyPluginAsync = async (fastify, _): Promise<void> => {
  fastify.get("/", async function (_, reply) {
    try {
      const connection = await azureConnection();
      const buildApi = await connection.getBuildApi();

      const project = "AzureDemo";

      const yamlProcess: YamlProcess = {
        type: 2,
        yamlFilename: "azure-pipelines.yml",
      };

      // https://dev.azure.com/{organization}/{project}/_apis/git/repositories?api-version=7.0

      const pipelineDefinition: BuildDefinition = {
        name: "Sample SDK Created Pipeline",
        type: DefinitionType.Build,
        repository: {
          id: process.env.REPO_ID,
          url: process.env.REPO_LINK,
          type: "TfsGit",
          defaultBranch: "refs/heads/main",
        },
        process: yamlProcess,
        queue: {
          id: 55,
        },
      };

      const createdPipeline = await buildApi.createDefinition(
        pipelineDefinition,
        project
      );

      return {
        message: "Pipeline created successfully",
        pipeline: createdPipeline,
      };
    } catch (error) {
      console.error("Error:", error);
      reply.status(500).send({ error: error });
    }
  });
};

export default root;
