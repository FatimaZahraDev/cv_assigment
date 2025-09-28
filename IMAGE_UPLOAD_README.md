# Image Upload Implementation

This implementation provides a unified solution for uploading both **profile pictures** and **cover pictures** using the `allTypeFileUpload` API endpoint.

## Features

- ✅ Single API endpoint for both image types
- ✅ No code repetition
- ✅ Simple and easy to use
- ✅ Follows existing code structure
- ✅ No UI changes required
- ✅ Built-in validation and error handling
- ✅ Loading states and progress tracking
- ✅ Different UI components for different upload types

## File Structure

```
src/
├── services/
│   ├── uploadService.js          # Core upload service
│   └── api.js                    # API endpoints (already exists)
├── hooks/
│   └── useImageUpload.js         # React hook for upload functionality
├── components/shared/upload/
│   ├── uploadprofile.jsx         # Profile picture upload (circle)
│   └── uploadcover.jsx           # Cover picture upload (dragger)
├── pages/profilepages/
│   └── editprofile.jsx           # Updated Edit Profile page
└── examples/
    └── ImageUploadExample.jsx    # Usage examples
```

## API Endpoint

The implementation uses the existing `allTypeFileUpload` API endpoint:

```javascript
// From src/services/api.js
allTypeFileUpload: { method: "POST", url: "upload-image" }
```

## Payload Structure

### Profile Image Upload
```javascript
FormData:
Key: "profile_image" -> Value: File (binary image file object)
```

### Cover Image Upload
```javascript
FormData:
Key: "cover_image" -> Value: File (binary image file object)
```

## Edit Profile Page Implementation

The Edit Profile page now includes both profile and cover image upload options with different UI styles:

```jsx
// Profile Picture Upload (Circle UI)
<div className="mb-3">
  <label className="form-label text-white">Profile Picture</label>
  <UploadProfile
    imageType="profile_image"
    initialImageUrl={profileData?.profile_image}
    onUploadSuccess={(data, imageType) => {
      console.log(`${imageType} uploaded successfully:`, data);
    }}
  />
</div>

// Cover Picture Upload (Dragger UI)
<div className="mb-4">
  <label className="form-label text-white">Cover Picture</label>
  <UploadCover
    initialImageUrl={profileData?.cover_image}
    onUploadSuccess={(data, imageType) => {
      console.log(`${imageType} uploaded successfully:`, data);
    }}
  />
</div>
```

## Component Differences

### UploadProfile Component
- **UI Style**: Circular upload area (like profile pictures)
- **Use Case**: Profile pictures
- **Props**: `imageType`, `initialImageUrl`, `onUploadSuccess`

### UploadCover Component  
- **UI Style**: Dragger component (like Create Event feature)
- **Use Case**: Cover pictures
- **Props**: `initialImageUrl`, `onUploadSuccess`
- **Features**: 
  - Larger upload area
  - Drag and drop functionality
  - Background image preview
  - 5MB file size limit

## Usage Examples

### 1. Profile Picture Upload

```jsx
import UploadProfile from "@/components/shared/upload/uploadprofile";

<UploadProfile
  imageType="profile_image"
  onUploadSuccess={(data, imageType) => {
    console.log("Profile uploaded:", data);
  }}
  initialImageUrl={existingProfileUrl}
/>
```

### 2. Cover Picture Upload

```jsx
import UploadCover from "@/components/shared/upload/uploadcover";

<UploadCover
  onUploadSuccess={(data, imageType) => {
    console.log("Cover uploaded:", data);
  }}
  initialImageUrl={existingCoverUrl}
/>
```

### 3. Using the Upload Service Directly

```javascript
import uploadService from "@/services/uploadService";

// Upload profile image
const uploadProfileImage = async (file) => {
  try {
    const result = await uploadService.uploadProfileImage(file, {
      showSuccessNotification: true,
    });
    console.log("Profile image uploaded:", result);
  } catch (error) {
    console.error("Upload failed:", error);
  }
};

// Upload cover image
const uploadCoverImage = async (file) => {
  try {
    const result = await uploadService.uploadCoverImage(file, {
      showSuccessNotification: true,
    });
    console.log("Cover image uploaded:", result);
  } catch (error) {
    console.error("Upload failed:", error);
  }
};
```

## Component Props

### UploadProfile Component

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `imageType` | `string` | `"profile_image"` | Type of image: `"profile_image"` or `"cover_image"` |
| `onUploadSuccess` | `function` | `undefined` | Callback when upload succeeds `(data, imageType) => {}` |
| `initialImageUrl` | `string` | `undefined` | Initial image URL to display |

### UploadCover Component

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onUploadSuccess` | `function` | `undefined` | Callback when upload succeeds `(data, imageType) => {}` |
| `initialImageUrl` | `string` | `undefined` | Initial image URL to display |

## Service Methods

### uploadService

| Method | Parameters | Description |
|--------|------------|-------------|
| `uploadProfileImage(file, options)` | `file: File, options: Object` | Upload profile image |
| `uploadCoverImage(file, options)` | `file: File, options: Object` | Upload cover image |
| `uploadImage(imageType, file, options)` | `imageType: string, file: File, options: Object` | Generic upload method |
| `validateImageFile(file, options)` | `file: File, options: Object` | Validate image file |

### useImageUpload Hook

| Return Value | Type | Description |
|--------------|------|-------------|
| `loading` | `boolean` | Upload loading state |
| `uploadProgress` | `number` | Upload progress (0-100) |
| `uploadProfileImage` | `function` | Upload profile image method |
| `uploadCoverImage` | `function` | Upload cover image method |
| `uploadImage` | `function` | Generic upload method |

## Validation

Built-in validation includes:
- **Profile Images**: JPEG, PNG, JPG up to 2MB
- **Cover Images**: JPEG, PNG, JPG up to 5MB
- Custom validation options

```javascript
const validation = uploadService.validateImageFile(file, {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ["image/jpeg", "image/png", "image/webp"],
});

if (!validation.isValid) {
  console.error(validation.error);
}
```

## Error Handling

The implementation includes comprehensive error handling:
- Network errors
- Validation errors
- Server errors
- User-friendly error messages via Ant Design notifications

## Integration with Existing Code

This implementation:
- ✅ Uses the existing `apiClient.js` structure
- ✅ Follows the existing API pattern in `api.js`
- ✅ Uses different UI components for different upload types
- ✅ Uses existing notification system
- ✅ Compatible with existing authentication flow
- ✅ Added to Edit Profile page without changing UI layout

## Testing the Implementation

1. Navigate to the Edit Profile page (`/profile/edit-profile`)
2. You will see:
   - **Profile Picture**: Circular upload component
   - **Cover Picture**: Dragger upload component (like Create Event)
3. Test uploading both types of images
4. Check network tab to verify correct FormData payload structure:
   - Profile: `profile_image: File`
   - Cover: `cover_image: File`
5. Verify API calls use the `allTypeFileUpload` endpoint

## Key Implementation Details

- **Correct Payload**: Single key-value pair where key is `profile_image` or `cover_image` and value is the binary file
- **Different UI Styles**: Profile uses circular component, Cover uses dragger component
- **No Code Repetition**: Both use the same underlying upload service
- **Proper Validation**: Different size limits for different image types
- **Existing Structure**: Follows your current code patterns and architecture

The implementation is ready to use and provides the exact functionality you requested!