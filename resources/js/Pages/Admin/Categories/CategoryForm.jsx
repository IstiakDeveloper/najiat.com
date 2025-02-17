import React from "react";
import { useForm, Head, Link } from "@inertiajs/inertia-react";
import { Inertia } from "@inertiajs/inertia";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Switch } from "@/Components/ui/switch";

const CategoryForm = ({ category = null }) => {
    const { data, setData, errors, processing } = useForm({
        name: category ? category.name : "",
        description: category ? category.description : "",
        is_active: category ? category.is_active : true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (category) {
            // Update existing category
            Inertia.put(route("admin.categories.update", category.id), data);
        } else {
            // Create new category
            Inertia.post(route("admin.categories.store"), data);
        }
    };

    return (
        <AdminLayout>
            <Head
                title={
                    category
                        ? `Edit Category: ${category.name}`
                        : "Create New Category"
                }
            />

            <Card>
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle>
                            {category ? "Edit Category" : "Create New Category"}
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Category Name
                            </label>
                            <Input
                                type="text"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                placeholder="Enter category name"
                                className="mt-1"
                            />
                            {errors.name && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <Textarea
                                value={data.description || ""}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                                placeholder="Enter category description (optional)"
                                className="mt-1"
                                rows={4}
                            />
                            {errors.description && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center space-x-2">
                            <Switch
                                checked={data.is_active}
                                onCheckedChange={(checked) =>
                                    setData("is_active", checked)
                                }
                            />
                            <label className="text-sm font-medium">
                                Active Category
                            </label>
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-between">
                        <Link href={route("admin.categories.index")}>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            {category ? "Update Category" : "Create Category"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </AdminLayout>
    );
};

export default CategoryForm;
