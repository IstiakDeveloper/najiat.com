<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class BookMediaService
{
    /**
     * Upload book cover image
     */
    public function uploadCoverImage(UploadedFile $file): string
    {
        // Generate a unique filename
        $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();

        // Store the file in the books/covers directory
        $path = $file->storeAs(
            'books/covers',
            $filename,
            'public'
        );

        return $path;
    }

    /**
     * Upload book preview PDF
     */
    public function uploadPreviewPdf(UploadedFile $file): string
    {
        // Generate a unique filename
        $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();

        // Store the file in the books/previews directory
        $path = $file->storeAs(
            'books/previews',
            $filename,
            'public'
        );

        return $path;
    }

    /**
     * Delete old media file
     */
    public function deleteOldMedia(?string $path): void
    {
        if ($path && Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
    }
}
