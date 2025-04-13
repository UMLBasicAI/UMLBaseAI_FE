module.exports = {
  apps: [
    {
      name: "nextjs-app",
      script: "npx",
      args: "next start -p 3000",
      cwd: "/home/adminplantuml/apps/umlbasicai-fe/production",
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
