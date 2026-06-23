import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export const reviewSchema = z.object({
    rating: z.number().min(1).max(5),
    title: z.string().min(3, "Title must be at least 3 characters").max(100),
    content: z.string().min(10, "Review must be at least 10 characters").max(1000),
    category: z.enum(["Academics", "Infrastructure", "Placements", "Campus Life"]),
});

export const collegeQuerySchema = z.object({
    search: z.string().optional(),
    state: z.string().optional(),
    type: z.string().optional(),
    ownership: z.string().optional(),
    minFees: z.coerce.number().optional(),
    maxFees: z.coerce.number().optional(),
    minRating: z.coerce.number().optional(),
    sortBy: z.enum(["rating", "fees", "name", "ranking"]).optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
    page: z.coerce.number().min(1).optional().default(1),
    limit: z.coerce.number().min(1).max(50).optional().default(12),
});
