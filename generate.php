<?php
// Your OpenRouter API Key (replace with yours)
$apiKey = '';  // 🔐 Replace with your actual key

// Get form inputs
$name = $_POST['name'] ?? '';
$email = $_POST['email'] ?? '';
$phone = $_POST['phone'] ?? '';
$linkedin = $_POST['linkedin'] ?? '';  // Add LinkedIn ID input
$education = $_POST['education'] ?? '';
$skills = $_POST['skills'] ?? '';
$experience = $_POST['experience'] ?? '';
$projects = $_POST['projects'] ?? '';
$objective = $_POST['objective'] ?? '';

// Prompt sent to AI
$prompt = "Create a highly professional and detailed resume based on these details. Expand and exaggerate the information as needed to provide a comprehensive and formal resume:\n";
$prompt .= "Name: $name\nEmail: $email\nPhone: $phone\nLinkedIn: $linkedin\n";  // Add LinkedIn ID to the prompt
$prompt .= "Education: $education\n";
$prompt .= "Skills: $skills\nExperience: $experience\nProjects: $projects\n";
if (!empty($objective)) {
    $prompt .= "Objective: Please expand and provide more detailed context about the objective. For example, if the objective is about working in the EV bicycle startup, describe what this entails, why it's important, and what specific goals are associated with it. The objective should be detailed and professional.$objective\n";
}
$prompt .= "\nMake sure the resume is in clean, professional, and readable text format with proper sections and clear formatting. Use proper bullet points for skills and experience, and expand on any information provided to make it sound professional and complete.";

// Setup cURL request to OpenRouter
$ch = curl_init("https://openrouter.ai/api/v1/chat/completions");

$headers = [
    "Authorization: Bearer $apiKey",
    "Content-Type: application/json",
    "HTTP-Referer: http://localhost/ai-resume-builder/",
    "X-Title: AI Resume Builder"
];

$data = [
    "model" => "openai/gpt-3.5-turbo",
    "messages" => [
        ["role" => "user", "content" => $prompt]
    ]
];

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

// 👇 Use this ONLY if you face SSL errors on localhost
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

$response = curl_exec($ch);

if (curl_errno($ch)) {
    echo "cURL Error: " . curl_error($ch);
} else {
    $result = json_decode($response, true);
    if (isset($result['choices'][0]['message']['content'])) {
        // Show AI-generated resume with line breaks
        echo nl2br(htmlspecialchars($result['choices'][0]['message']['content']));
    } else {
        echo "Error: Invalid response from AI.";
    }
}

curl_close($ch);
?>
