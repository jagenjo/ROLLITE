// vite.config.ts
import { defineConfig } from "file:///E:/PROJECTS/WEB/ROLLITE/node_modules/vite/dist/node/index.js";
var vite_config_default = defineConfig({
  root: ".",
  build: {
    outDir: "dist/client",
    emptyOutDir: true
  },
  server: {
    port: 5173,
    proxy: {
      // Proxy socket.io to server
      "/socket.io": {
        target: "http://localhost:4001",
        ws: true
      },
      "/upload": {
        target: "http://localhost:4001"
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxQUk9KRUNUU1xcXFxXRUJcXFxcUk9MTElURVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRTpcXFxcUFJPSkVDVFNcXFxcV0VCXFxcXFJPTExJVEVcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0U6L1BST0pFQ1RTL1dFQi9ST0xMSVRFL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gICAgcm9vdDogJy4nLFxyXG4gICAgYnVpbGQ6IHtcclxuICAgICAgICBvdXREaXI6ICdkaXN0L2NsaWVudCcsXHJcbiAgICAgICAgZW1wdHlPdXREaXI6IHRydWUsXHJcbiAgICB9LFxyXG4gICAgc2VydmVyOiB7XHJcbiAgICAgICAgcG9ydDogNTE3MyxcclxuICAgICAgICBwcm94eToge1xyXG4gICAgICAgICAgICAvLyBQcm94eSBzb2NrZXQuaW8gdG8gc2VydmVyXHJcbiAgICAgICAgICAgICcvc29ja2V0LmlvJzoge1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0OiAnaHR0cDovL2xvY2FsaG9zdDo0MDAxJyxcclxuICAgICAgICAgICAgICAgIHdzOiB0cnVlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICcvdXBsb2FkJzoge1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0OiAnaHR0cDovL2xvY2FsaG9zdDo0MDAxJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUErUCxTQUFTLG9CQUFvQjtBQUU1UixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUN4QixNQUFNO0FBQUEsRUFDTixPQUFPO0FBQUEsSUFDSCxRQUFRO0FBQUEsSUFDUixhQUFhO0FBQUEsRUFDakI7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNKLE1BQU07QUFBQSxJQUNOLE9BQU87QUFBQTtBQUFBLE1BRUgsY0FBYztBQUFBLFFBQ1YsUUFBUTtBQUFBLFFBQ1IsSUFBSTtBQUFBLE1BQ1I7QUFBQSxNQUNBLFdBQVc7QUFBQSxRQUNQLFFBQVE7QUFBQSxNQUNaO0FBQUEsSUFDSjtBQUFBLEVBQ0o7QUFDSixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
