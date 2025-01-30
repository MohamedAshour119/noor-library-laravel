{{-- Ensure state is a string --}}
{{--@dd($pdfUrl)--}}
@if (!empty($pdfUrl))
    <p class="text-gray-500 italic">PDF File</p>
    <iframe src="{{ $pdfUrl }}" width="100%" height="500px" class="border rounded-lg shadow"></iframe>
@else
    <p class="text-gray-500 italic">No PDF available</p>
@endif
