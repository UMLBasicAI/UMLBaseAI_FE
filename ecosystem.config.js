module.exports = {
  apps: [
    {
      name: "nextjs-production",
      script: "npx",
      args: "next start -p 3000",
      cwd: "/home/adminplantuml/apps/umlbasicai-fe/production",
      env: {
        NODE_ENV: "production"
      }
    },
    {
      name: "nextjs-development",
      script: "npx",
      args: "next start -p 3001",
      cwd: "/home/adminplantuml/apps/umlbasicai-fe/development",
      env: {
        NODE_ENV: "development"
      }
    },
    {
      name: "nextjs-test",
      script: "npx",
      args: "next start -p 3002",
      cwd: "/home/adminplantuml/apps/umlbasicai-fe/tst",
      env: {
        NODE_ENV: "test"
      }
    }
  ]
};
