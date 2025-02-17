<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Book extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'price',
        'stock_quantity',
        'isbn',
        'page_count',
        'publication_date',
        'language',
        'discount_percentage',
        'author_id',
        'category_id',
        'is_featured',
        'is_active',
        'cover_image',
        'preview_pdf' // Added new fields
    ];

    protected $dates = ['publication_date'];
    protected $casts = [
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'publication_date' => 'date',
        'price' => 'float',
        'discount_percentage' => 'float'
    ];


    protected static function boot()
    {
        parent::boot();

        // Ensure required fields are not null
        static::creating(function ($model) {
            if (empty($model->title)) {
                throw new \Exception('Title cannot be empty');
            }
            if (empty($model->author_id)) {
                throw new \Exception('Author is required');
            }
            if (empty($model->category_id)) {
                throw new \Exception('Category is required');
            }
        });
    }

    // Auto-generate slug when setting title
    public function setTitleAttribute($value)
    {
        $this->attributes['title'] = $value;
        $this->attributes['slug'] = Str::slug($value);
    }

    // Relationships
    public function author()
    {
        return $this->belongsTo(Author::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function wishlistItems()
    {
        return $this->hasMany(Wishlist::class);
    }

    // Scopes
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true)->where('is_active', true);
    }

    // Calculated Attributes
    public function getCurrentPriceAttribute()
    {
        return $this->price * (1 - ($this->discount_percentage / 100));
    }

    // Image and PDF URL accessors
    public function getCoverImageUrlAttribute()
    {
        return $this->cover_image ? asset('storage/' . $this->cover_image) : null;
    }

    public function getPreviewPdfUrlAttribute()
    {
        return $this->preview_pdf ? asset('storage/' . $this->preview_pdf) : null;
    }



}
