<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            "Fiction", "Non-Fiction", "Mystery", "Fantasy", "Science Fiction",
            "Biography", "History", "Romance", "Self-Help", "Philosophy",
            "Psychology", "Poetry", "Horror", "Thriller", "Children",
            "Young Adult", "Art", "Cookbooks", "Comics", "Graphic Novels",
            "Travel", "Science", "Business", "Spirituality", "Sports",
            "Education", "Drama", "Humor", "Technology", "Politics"
        ];

        foreach ($categories as $category) {
            Category::firstOrCreate(['name' => $category]);
        }
    }
}
