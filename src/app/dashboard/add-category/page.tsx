import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const metadata = {
  title: "Add Category - E-commerce",
};

export default async function AddCategoryPage() {
  async function addCategory(formData: FormData) {
    "use server";

    const category = formData.get("category")?.toString();

    if (!category) throw Error("un champs est manquants");

    await prisma.category.create({
      data: { name: category },
    });

    redirect("/");
  }

  return (
    <>
      <div>
        <h1 className="text-lg mb-3">Add Category</h1>
        <form action={addCategory} className="space-y-4 w-[40rem] mb-4">
          <Input
            required={true}
            id="category"
            type="text"
            name="category"
            placeholder="Categorie"
          />
          <Button aria-label="Ajouter une catégorie">Add Category</Button>
        </form>
      </div>
    </>
  );
}
