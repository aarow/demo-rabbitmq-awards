// import express from "express";
import monitorAwards from "@/features/monitorAwards";
import seedAwards from "@/postgresql/seedAwards";
import web from "@/features/web";

main();

export default async function main() {
  try {
    await seedAwards();
    monitorAwards();
    // web();
  } catch (error) {
    console.error(error);
  }
}
