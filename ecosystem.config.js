module.exports = {
    apps: [
      {
        name: "nextjs-app",
        script: "node_modules/next/dist/bin/next",
        args: "start -p 3000",
        cwd: "/home/azureuser/nextjs-app",
        env: {
          NODE_ENV: "production"
        }
      }
    ]
  };
      