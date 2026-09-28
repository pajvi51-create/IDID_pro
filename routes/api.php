<?php

use App\Http\Controllers\Api\SnruStudentApiController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| SNRU Student REST API Routes
|--------------------------------------------------------------------------
*/

Route::prefix('snru')->group(function () {
    Route::get('/students', [SnruStudentApiController::class, 'index'])->name('api.snru.students');
    Route::get('/student/{id?}', [SnruStudentApiController::class, 'show'])->name('api.snru.student');
    Route::get('/faculties', [SnruStudentApiController::class, 'faculties'])->name('api.snru.faculties');
    Route::get('/majors', [SnruStudentApiController::class, 'majors'])->name('api.snru.majors');
});
