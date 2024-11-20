import * as azdev from "azure-devops-node-api";

export async function azureConnection(): Promise<azdev.WebApi> {
  const token = process.env.PERSONAL_TOKEN || "";
  const orgUrl = process.env.ORGANIZATION || "";

  const authHandler = azdev.getPersonalAccessTokenHandler(token);
  const connection = new azdev.WebApi(orgUrl, authHandler);

  return connection;
}
