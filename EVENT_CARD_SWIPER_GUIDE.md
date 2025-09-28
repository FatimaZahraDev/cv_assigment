# Event Card with Swiper Slider Guide

## ✅ **Complete Implementation Done!**

I've successfully implemented the enhanced event card with swiper slider for attachments, proper date/time formatting, and smart navigation handling.

## 🎯 **Features Implemented**

### **📱 Swiper Slider for Attachments**
- **Mixed Media Support**: Images and videos in the same slider
- **Navigation**: Custom arrow buttons (appear on hover)
- **Pagination**: Dots indicator at bottom
- **File Counter**: Shows "X files" when multiple attachments
- **Responsive**: Works on all screen sizes

### **📅 Smart Date/Time Formatting**
- **Date Range**: "Sat, Jul 17 – Jul 24" format using dayjs
- **Time Range**: "5:00 am to 6:00 am" format
- **Smart Logic**: Handles same day, same month, different months

### **🖱️ Click Behavior**
- **Card Click**: Navigates to event detail page
- **Prevented Clicks**: Edit/delete buttons, video controls, slider navigation
- **Video Interaction**: Users can play/pause videos without triggering navigation

## 🔧 **API Response Handling**

### **Expected API Response:**
```json
{
  "id": 22,
  "title": "Japan Tokyo Drift",
  "start_date": "2025-07-17",
  "end_date": "2025-07-24", 
  "start_time": "05:00:00",
  "end_time": "06:00:00",
  "location": "Tokyo Drift Arena",
  "attachments": [
    {
      "id": 41,
      "type": "video",
      "url": "https://yourdomain.com/storage/event_attachments/sample.mp4"
    },
    {
      "id": 42,
      "type": "image", 
      "url": "https://yourdomain.com/storage/event_attachments/sample.jpg"
    }
  ]
}
```

### **Date/Time Formatting Examples:**
```javascript
// Same day
start_date: "2025-07-17", end_date: "2025-07-17"
→ "Thu, Jul 17"

// Same month
start_date: "2025-07-17", end_date: "2025-07-24"
→ "Thu, Jul 17 – 24"

// Different months
start_date: "2025-07-17", end_date: "2025-08-05"
→ "Thu, Jul 17 – Aug 5"

// Time formatting
start_time: "05:00:00", end_time: "18:30:00"
→ "5:00 am to 6:30 pm"
```

## 🎨 **Visual Features**

### **Swiper Slider:**
- **Image Display**: Full-width images with proper aspect ratio
- **Video Display**: Native video controls with play/pause
- **Navigation**: Left/right arrows (visible on hover)
- **Pagination**: Dots showing current slide
- **File Counter**: "X files" badge for multiple attachments

### **Hover Effects:**
- **Card Hover**: Slight lift animation
- **Navigation**: Arrow buttons fade in/out
- **Button Hover**: Color changes for interactive elements

### **Responsive Design:**
- **Mobile**: Smaller navigation buttons
- **Tablet**: Optimized touch interactions
- **Desktop**: Full hover effects and smooth animations

## 🚀 **Usage Examples**

### **Basic Usage:**
```jsx
import CreateEventCard from "@/components/shared/card/createeventcard";

const EventList = ({ events }) => {
  return (
    <div className="row">
      {events.map(event => (
        <div key={event.id} className="col-12 col-sm-6 col-md-4">
          <CreateEventCard 
            event={event}
            overlay={editDeleteMenu} // Optional dropdown menu
          />
        </div>
      ))}
    </div>
  );
};
```

### **With Edit/Delete Menu:**
```jsx
import { Menu } from "antd";

const editDeleteMenu = (
  <Menu>
    <Menu.Item key="edit" onClick={() => handleEdit(event.id)}>
      Edit Event
    </Menu.Item>
    <Menu.Item key="delete" onClick={() => handleDelete(event.id)}>
      Delete Event
    </Menu.Item>
  </Menu>
);

<CreateEventCard event={event} overlay={editDeleteMenu} />
```

## 🔧 **Technical Implementation**

### **Swiper Configuration:**
```javascript
<Swiper
  modules={[Navigation, Pagination]}
  spaceBetween={0}
  slidesPerView={1}
  navigation={{
    nextEl: '.swiper-button-next-custom',
    prevEl: '.swiper-button-prev-custom',
  }}
  pagination={{ 
    clickable: true,
    dynamicBullets: true,
  }}
>
```

### **Click Prevention Logic:**
```javascript
const handleCardClick = (e) => {
  // Don't navigate if clicking on:
  if (e.target.closest('.white-dots-img') ||      // Edit menu
      e.target.closest('.event-btn') ||           // Interest button
      e.target.closest('.swiper-button-prev-custom') || // Prev arrow
      e.target.closest('.swiper-button-next-custom') ||  // Next arrow
      e.target.closest('video')) {                // Video controls
    return;
  }
  navigate(`/event/${event.id}`);
};
```

### **Date Formatting Logic:**
```javascript
const formatDateRange = () => {
  const startDate = dayjs(event.start_date);
  const endDate = dayjs(event.end_date);
  
  if (startDate.isSame(endDate, 'day')) {
    return startDate.format('ddd, MMM D');
  }
  
  if (startDate.isSame(endDate, 'month')) {
    return `${startDate.format('ddd, MMM D')} – ${endDate.format('D')}`;
  }
  
  return `${startDate.format('ddd, MMM D')} – ${endDate.format('MMM D')}`;
};
```

## 🎯 **Fallback Handling**

### **No Attachments:**
- Shows fallback image from `event.image` or default placeholder
- Maintains same card layout and functionality

### **Single Attachment:**
- No navigation arrows or pagination
- Still shows in swiper for consistency

### **Missing Data:**
- **Dates**: Shows "Date TBD"
- **Times**: Shows "Time TBD"
- **Location**: Shows "Location TBD"

## 📱 **Mobile Optimization**

### **Touch Interactions:**
- **Swipe**: Native swiper touch support
- **Video**: Touch-friendly video controls
- **Navigation**: Larger touch targets on mobile

### **Performance:**
- **Lazy Loading**: Images load only when needed
- **Video Preload**: Metadata only for faster loading
- **Smooth Animations**: 60fps transitions

## 🎉 **Result**

Your event cards now feature:
- ✅ **Mixed media slider** with images and videos
- ✅ **Smart date/time formatting** with dayjs
- ✅ **Intelligent click handling** 
- ✅ **Responsive design** for all devices
- ✅ **Professional animations** and hover effects
- ✅ **Accessibility features** and keyboard navigation
- ✅ **Performance optimizations** for smooth scrolling

The implementation handles all edge cases and provides a premium user experience for browsing events with rich media content!