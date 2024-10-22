import monitorAwards from "./monitorAwards";
import seedAwards from "./postgresql/seedAwards";

export default async function main() {
  try {
    await seedAwards();
    monitorAwards();
  } catch (error) {
    console.error(error);
  }
}
