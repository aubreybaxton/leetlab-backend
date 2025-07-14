import {PrismaClient} from "../generated/prisma/index.js"

const GlobalForPrisma= globalThis;

// if created use otherwise create new instance for prisma client

export const db = GlobalForPrisma.prisma || new PrismaClient();

if( process.env.NODE_ENV !== "production") GlobalForPrisma.prisma = db

