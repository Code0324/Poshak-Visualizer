// =============================================
// FabricToModel — Shared TypeScript Types
// =============================================

// --- Enums / Unions ---

export type FabricType = "unstitched" | "stitched";

export type OutfitType = "1pc" | "2pc" | "3pc";

export type Occasion = "casual" | "formal" | "wedding" | "festive" | "party";

/** Which model pose to use for try-on generation */
export type ModelPose = "front" | "three-quarter" | "side";

/** Pipeline step the current job is on */
export type GenerationStatus =
  | "idle"
  | "uploading"       // Uploading original image to Cloudinary
  | "segmenting"      // SAM segmenting the garment
  | "generating"      // IDM-VTON generating try-on image
  | "styling"         // Claude generating styling suggestions
  | "complete"
  | "error";

// --- API Request / Response Shapes ---

export interface UploadRequest {
  fabricType: FabricType;
  outfitType: OutfitType;
  occasion: Occasion;
}

export interface UploadResponse {
  imageUrl: string;   // Cloudinary URL
  publicId: string;   // Cloudinary public ID for deletion
}

export interface SegmentationResponse {
  segmentedImageUrl: string;
}

export interface TryOnRequest {
  segmentedImageUrl: string;
  modelPose: ModelPose;
}

export interface TryOnResponse {
  generatedImageUrl: string;
  jobId: string;
}

/** Claude styling response — must match backend Pydantic model */
export interface StylingResponse {
  outfit_name: string;
  suggested_pieces: string[];
  occasion_tags: string[];
  styling_tips: string[];       // Always 3 items
  color_suggestions: string[];
}

// --- Database / History ---

export interface GenerationRecord {
  id: string;
  originalImageUrl: string;
  segmentedImageUrl: string;
  generatedImageUrl: string;
  styling: StylingResponse;
  fabricType: FabricType;
  outfitType: OutfitType;
  occasion: Occasion;
  modelPose: ModelPose;
  createdAt: string;            // ISO timestamp
}

// --- UI State ---

export interface GenerationState {
  status: GenerationStatus;
  error: string | null;
  originalImageUrl: string | null;
  segmentedImageUrl: string | null;
  generatedImageUrl: string | null;
  styling: StylingResponse | null;
  uploadProgress: number;       // 0-100
}

// --- API Error ---

export interface ApiError {
  detail: string;
  status: number;
}
