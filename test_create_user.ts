import { createUserAction } from './app/(dashboard)/admin/users/new/actions'

async function run() {
  const res = await createUserAction({
    fullName: "Alex Test",
    email: "alex.test." + Date.now() + "@example.com",
    role: "founder"
  });
  console.log("Result:", res);
}

run();
