"use client";

import { useState } from "react";

interface PromptFormProps {
  onSubmit: (prompt: string) => Promise<void>;
  isLoading: boolean;
}

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "non-binary", label: "Non-binary" },
];

const ageOptions = [
  { value: "18", label: "18-25" },
  { value: "28", label: "26-35" },
  { value: "42", label: "36-45" },
  { value: "55", label: "46-60" },
  { value: "68", label: "60+" },
];

const ethnicityOptions = [
  { value: "African", label: "African" },
  { value: "East Asian", label: "East Asian" },
  { value: "South Asian", label: "South Asian" },
  { value: "Caucasian", label: "Caucasian" },
  { value: "Hispanic/Latino", label: "Hispanic/Latino" },
  { value: "Middle Eastern", label: "Middle Eastern" },
  { value: "Mixed ethnicity", label: "Mixed" },
];

const backgroundOptions = [
  { value: "modern kitchen, refrigerator magnets, coffee mug on counter", label: "Kitchen" },
  { value: "living room couch, TV in background, houseplants", label: "Living Room" },
  { value: "bedroom, unmade bed, fairy lights", label: "Bedroom" },
  { value: "office desk, monitor, sticky notes", label: "Home Office" },
  { value: "car interior, steering wheel visible, parking lot outside", label: "Car" },
  { value: "coffee shop, other patrons blurred, exposed brick wall", label: "Coffee Shop" },
  { value: "outdoor park, trees and grass, natural daylight", label: "Park" },
  { value: "urban street, buildings and signs, city vibe", label: "Street" },
  { value: "gym, exercise equipment, mirrors", label: "Gym" },
  { value: "grocery store aisle, shelves with products, fluorescent lighting", label: "Grocery Store" },
];

const expressionOptions = [
  { value: "casual, mid-sentence, natural eye contact with lens", label: "Casual/Talking" },
  { value: "genuine smile, slight laugh lines, relaxed", label: "Smiling" },
  { value: "thoughtful, slight head tilt, contemplative", label: "Thoughtful" },
  { value: "surprised, raised eyebrows, open mouth", label: "Surprised" },
  { value: "confident, slight smirk, direct gaze", label: "Confident" },
  { value: "serious, neutral expression, focused", label: "Serious" },
];

export default function PromptForm({ onSubmit, isLoading }: PromptFormProps) {
  const [gender, setGender] = useState("male");
  const [age, setAge] = useState("28");
  const [ethnicity, setEthnicity] = useState("Caucasian");
  const [background, setBackground] = useState("modern kitchen, refrigerator magnets, coffee mug on counter");
  const [expression, setExpression] = useState("casual, mid-sentence, natural eye contact with lens");
  const [customDetails, setCustomDetails] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const buildPrompt = () => {
    const customFeatures = customDetails.trim() ? `, ${customDetails.trim()}` : "";

    // Get the background label for environment details
    const bgOption = backgroundOptions.find(opt => opt.value === background);
    const bgLabel = bgOption?.label || "Kitchen";

    const promptJson = {
      request_type: "image_generation",
      model: "nano_banana_pro",
      parameters: {
        aspect_ratio: "9:16",
        subject: {
          description: `${age}-year-old ${gender}, ${ethnicity} features, average looking, not a model${customFeatures}`,
          expression: expression,
          skin_texture: "oily skin, visible pores, redness, dark circles under eyes, imperfect complexion, no makeup or minimal makeup",
          appearance: "slightly disheveled, casual, not trying to look good"
        },
        composition: {
          shot_type: "quick front-camera selfie, taken in a hurry",
          framing: "poorly framed, face partially cut off, awkward angle, too close or too far",
          camera_angle: "unflattering front camera angle, slight double chin angle",
          mistakes: "thumb slightly visible at edge, tilted horizon"
        },
        environment: {
          setting: `${bgLabel.toLowerCase()}, cluttered and messy background`,
          details: background,
          depth_of_field: "everything somewhat in focus, cheap phone camera, no artistic blur"
        },
        lighting_and_color: {
          source: "ugly fluorescent overhead lighting, or harsh window light from one side",
          effects: "unflattering shadows under eyes and nose, shiny forehead, uneven lighting on face",
          color_grade: "green/yellow color cast from indoor lights, oversaturated or undersaturated, wrong white balance",
          exposure: "face slightly overexposed or underexposed, blown highlights on forehead"
        },
        technical_fidelity: {
          noise_level: "grainy image, heavy noise in darker areas, poor low-light performance",
          lens_artifacts: "soft focus, front camera blur, smudged lens look, barrel distortion on face edges",
          compression: "heavy jpeg artifacts, blocky compression, instagram-recompressed quality",
          resolution: "low resolution feel, 720p phone camera quality, pixelated when zoomed",
          style: "REAL PHOTOGRAPH of a real human being, authentic amateur selfie, real person's camera roll, not meant to be shared publicly, unflattering casual photo"
        },
        critical: {
          format: "THIS MUST BE A REAL PHOTOGRAPH, NOT AN ILLUSTRATION",
          realism: "photorealistic, actual photo, real human, real skin, real environment"
        }
      },
      negative_prompt: "illustration, cartoon, animated, anime, digital art, painting, drawing, sketch, artwork, artistic rendering, CGI, 3D render, vector art, graphic design, stylized, watercolor, oil painting, professional photo, studio lighting, perfect skin, beautiful, attractive, model, influencer, good lighting, well-composed, artistic, aesthetic, filters, beauty mode, portrait mode, bokeh, sharp, high quality, 4K, HD, DSLR, mirrorless, good camera, photoshoot, glamour, retouched, edited, color corrected, good angle, flattering"
    };

    return JSON.stringify(promptJson, null, 2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading) {
      const finalPrompt = buildPrompt();
      await onSubmit(finalPrompt);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customization Options */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
            Gender
          </label>
          <select
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
          >
            {genderOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
            Age Range
          </label>
          <select
            id="age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
          >
            {ageOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="ethnicity" className="block text-sm font-medium text-gray-700 mb-1">
            Ethnicity
          </label>
          <select
            id="ethnicity"
            value={ethnicity}
            onChange={(e) => setEthnicity(e.target.value)}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
          >
            {ethnicityOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="expression" className="block text-sm font-medium text-gray-700 mb-1">
            Expression
          </label>
          <select
            id="expression"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
          >
            {expressionOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="col-span-2">
          <label htmlFor="background" className="block text-sm font-medium text-gray-700 mb-1">
            Background
          </label>
          <select
            id="background"
            value={background}
            onChange={(e) => setBackground(e.target.value)}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
          >
            {backgroundOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Custom Details */}
      <div>
        <label
          htmlFor="customDetails"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Additional details (optional)
        </label>
        <textarea
          id="customDetails"
          value={customDetails}
          onChange={(e) => setCustomDetails(e.target.value)}
          placeholder="e.g., short messy dark hair, 3-day stubble, wearing a grey hoodie, tattoo on forearm..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900"
          rows={2}
          disabled={isLoading}
        />
      </div>

      {/* Preview Toggle */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="w-full px-3 py-2 bg-gray-50 text-left text-sm font-medium text-gray-600 hover:bg-gray-100 flex justify-between items-center"
        >
          <span>JSON prompt preview</span>
          <span className="text-gray-400">{showPreview ? "▲" : "▼"}</span>
        </button>
        {showPreview && (
          <pre className="p-3 bg-gray-900 text-green-400 text-xs leading-relaxed max-h-60 overflow-y-auto font-mono whitespace-pre">
            {buildPrompt()}
          </pre>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? "Generating..." : "Generate Avatar"}
      </button>
    </form>
  );
}
