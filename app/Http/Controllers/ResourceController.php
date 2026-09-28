<?php

namespace App\Http\Controllers;

use App\Models\DownloadableForm;
use App\Models\Guideline;
use App\Models\Timeline;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ResourceController extends Controller
{
    public function guidelines(): Response
    {
        $guidelines = Guideline::where('is_published', true)->get();
        return Inertia::render('Resources/Guidelines', [
            'guidelines' => $guidelines,
        ]);
    }

    public function forms(): Response
    {
        $forms = DownloadableForm::where('is_active', true)->get();
        return Inertia::render('Resources/Forms', [
            'forms' => $forms,
        ]);
    }

    public function downloadForm(DownloadableForm $form)
    {
        $form->increment('download_count');

        // Check if sample or actual file exists
        $filePath = storage_path('app/public/' . $form->file_path);
        if (file_exists($filePath)) {
            return response()->download($filePath, $form->file_name);
        }

        // Return inline mock content for sample demo if file not on disk yet
        return response("เอกสารตัวอย่าง: " . $form->title, 200, [
            'Content-Type' => 'text/plain',
            'Content-Disposition' => 'attachment; filename="' . $form->file_name . '"',
        ]);
    }

    public function timeline(): Response
    {
        $timelines = Timeline::where('is_published', true)
            ->orderBy('start_date', 'asc')
            ->get();

        return Inertia::render('Resources/Timeline', [
            'timelines' => $timelines,
        ]);
    }
}
