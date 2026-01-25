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
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedPrompt, setEditedPrompt] = useState("");

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
          description: `${age}-year-old ${gender}, ${ethnicity} features, interesting distinctive face, not conventionally pretty but compelling and magnetic${customFeatures}`,
          expression: expression,
          hair: "messy disheveled hair, not styled",
          skin_texture: "natural skin with visible pores, minor blemishes, slight oiliness, no makeup",
          appearance: "casual and relaxed, effortlessly cool without trying",
          presence: "someone you'd notice in a crowd, expressive eyes, authentic character in face"
        },
        composition: {
          shot_type: "casual front-camera selfie",
          framing: "face noticeably off-center, shifted left or right in frame, part of head cropped out",
          camera_angle: "slightly tilted, imperfect handheld angle"
        },
        environment: {
          setting: `${bgLabel.toLowerCase()}`,
          details: background,
          depth_of_field: "background slightly out of focus but still recognizable, phone camera depth"
        },
        lighting_and_color: {
          source: "ambient indoor lighting matching the environment",
          effects: "natural shadows, slightly uneven lighting on face",
          color_grade: "slight color cast from indoor lights, not color corrected"
        },
        technical_fidelity: {
          noise_level: "slight grain visible, typical smartphone low-light",
          lens_artifacts: "soft focus typical of front camera, slight blur",
          quality: "smartphone camera quality, authentic candid photo",
          style: "real person's camera roll selfie, candid unplanned moment"
        }
      },
      negative_prompt: "professional photo, studio lighting, perfect skin, model, influencer, well-composed, artistic, filters, beauty mode, portrait mode, bokeh, DSLR, photoshoot, glamour, retouched, heavily edited"
    };

    return JSON.stringify(promptJson, null, 2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading) {
      const finalPrompt = isEditMode ? editedPrompt : buildPrompt();
      await onSubmit(finalPrompt);
    }
  };

  const handleEnterEditMode = () => {
    setEditedPrompt(buildPrompt());
    setIsEditMode(true);
    setShowPreview(true);
  };

  const handleExitEditMode = () => {
    setIsEditMode(false);
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
          <span>JSON prompt {isEditMode ? "(editing)" : "preview"}</span>
          <span className="text-gray-400">{showPreview ? "▲" : "▼"}</span>
        </button>
        {showPreview && (
          <div className="relative">
            {isEditMode ? (
              <textarea
                value={editedPrompt}
                onChange={(e) => setEditedPrompt(e.target.value)}
                disabled={isLoading}
                className="w-full p-3 bg-gray-900 text-green-400 text-xs leading-relaxed min-h-60 font-mono resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
                spellCheck={false}
              />
            ) : (
              <pre className="p-3 bg-gray-900 text-green-400 text-xs leading-relaxed max-h-60 overflow-y-auto font-mono whitespace-pre">
                {buildPrompt()}
              </pre>
            )}
            <div className="absolute top-2 right-2 flex gap-2">
              {isEditMode ? (
                <button
                  type="button"
                  onClick={handleExitEditMode}
                  disabled={isLoading}
                  className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded hover:bg-gray-600 transition-colors"
                >
                  Reset
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleEnterEditMode}
                  disabled={isLoading}
                  className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                >
                  Edit
                </button>
              )}
            </div>
          </div>
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
