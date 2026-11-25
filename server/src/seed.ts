import { insertAdminUser } from "./migrations/insertAdminUser";

(async () => {
  try {
    await insertAdminUser();
  } catch (error) {
    console.error("Error occurred while seeding admin user:", error);
  }
})();