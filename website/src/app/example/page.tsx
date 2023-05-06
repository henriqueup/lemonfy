import { routerCaller } from "src/server/api/root";

export default async function Page() {
  const hello = await routerCaller.example.hello({
    text: "from tRPC and RSC!",
  });

  return <h1>{hello.greeting}</h1>;
}
