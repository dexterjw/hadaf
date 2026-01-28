# **Hadaf: Comprehensive UI & Product Specification**

## **1\. Product Context**

**Goal:** A single-user prototype to simulate Quran memorization (Hifdh) timelines using dynamic forecasting.

**Persona:** Parent/Prototyper modeling scenarios for a student.

## **2\. Journey Milestones (Marhala)**

The entire memorization journey is structured around three key milestones, each called a **Marhala**:

* **Marhala 1 - The Foundation:** Juz 1 to 5  
  * Focus on building the foundation of memorization techniques and habits.
* **Marhala 2 - The Momentum:** Juz 6 to 20  
  * Building consistent momentum and increased capacity.
* **Marhala 3 - The Mastery:** Juz 21 to 30 + 6 months revision  
  * Achieving mastery, completing the final stretch, and conducting comprehensive revision of the entire Quran (Duhur).

## **3\. Core User Flow**

1. **Wizard:** User inputs baseline data (Script, Progress, Capacity).  
2. **Dashboard:** User views forecast and experiments with the "Pace Slider".  
3. **Tuning:** User opens "Advanced Settings" to customize the velocity curve (Warm-up vs. Flow state).  
4. **Reset:** User clears data to restart.

## **3\. Component Specifications**

### **3.1 Component: WizardStepper (Data Collection)**

**Functional Requirements (FR):**

* **FR-01 Quran Standard:** Select 13 (indo-pak), 15 (Standard), or 16 lines (Uthmani).  
  * Each Mushaf standard has different total pages and approximate pages per Juz:  
    | Mushaf Standard | Approx. Total Pages | Avg. Pages per Juz |
    |----------------|---------------------|--------------------|
    | 13-line Indo-Pak | ~850–870 pages | ~28–29 pages/juz (variable) |
    | 15-line Standard | ~604–611 pages | ~20 pages/juz |
    | 16-line Uthmani | ~604 pages | ~20 pages/juz |
  * **Default:** 15-line Standard with ~604 total pages.  
  * **FR-01a Total Pages Customization:** User can input the exact total number of pages in their specific Mushaf to accurately predict script length and progression (system will proportionally distribute pages across Juz).  
* **FR-02 Current Position:** Input specifically by **Juz** and **Page within Juz**.  
* **FR-03 Capacity:** Input "Average Lines per Day" and "Days per Week".

**UI Specifications:**

* **Step 1: Script Selection**  
  * **Visual:** Three Selectable Cards (13-Line, 15-Line, 16-Line).  
  * **State:** Visually distinguish the selected card (e.g., active border and background color).  
  * **Display:** Show approximate total pages and average pages per Juz for each Mushaf standard on the card.  
  * **Customization Option:** Optional "Enter Exact Total Pages" field where users can input the precise total page count from their specific Mushaf print (pre-populated with approximate defaults based on selected standard).  
    * This allows users to account for variation in different prints and predict timeline more accurately.  
    * The system will proportionally distribute the total pages across all 30 Juz based on typical Juz length ratios.  
* **Step 2: Progress Input**  
  * **Fields:** Two numeric inputs side-by-side: Current Juz (1-30) and Page in Juz.  
* **Step 3: Capacity Input**  
  * **Active Days:** Row of buttons \[4\] \[5\] \[6\] \[7\].  
  * **Base Pace:** Numeric input for "Lines per day".  
* **Action:** "Generate Forecast" button (Primary CTA).

### **3.2 Component: DashboardHeader (Feedback Layer)**

**Functional Requirements (FR):**

* **FR-09 Delta Display:** Visual indicator showing the difference between "Baseline" (Wizard input) and "Simulated" (Slider input) dates.

**UI Specifications:**

* **Layout:** Hero section at the top of the dashboard.  
* **Elements:**  
  * **Projected Date:** Large, dominant typography (e.g., "Oct 15, 2026").  
  * **Delta Badge:** Pill-shaped indicator.  
    * *Positive State:* "Saving X Months" (if Faster).  
    * *Negative State:* "Delaying X Months" (if Slower).  
    * *Neutral State:* "Standard Pace".

### **3.3 Component: PaceSlider (The Simulator)**

**Functional Requirements (FR):**

* **FR-06 Simulation:** Updates the logic engine in real-time.  
* **FR-08 Range:** Adjustable from 1 line to 45 lines/day.

**UI Specifications:**

* **Visuals:**  
  * **Track:** Visual gradient indicating intensity (e.g., Sustainable \-\> Aggressive \-\> Burnout).  
  * **Handle:** Large touch target.  
* **Interaction:** Dragging triggers immediate date recalculation (no "Apply" button).  
* **Feedback:** Label above slider displaying current value (e.g., "15 Lines / day").  
* **Warning:** If value \> 25, show "⚠️ High Burnout Risk" alert below slider.

### **3.4 Component: ProgressChart (Visualization)**

**Functional Requirements (FR):**

* **FR-10 Non-Linear Visualization:** Display a line graph showing cumulative progress over time.  
* **FR-11 Holiday Markers:** Visually indicate periods of flat progress (breaks).  
* **FR-10a Prominent Display:** Chart must be one of the largest components in the interface, utilizing maximum available screen space.

**UI Specifications:**

* **Size & Layout:**  
  * Chart should occupy a prominent position and maximum horizontal/vertical space available.  
  * Prioritize chart readability over compactness—this is a primary decision-making tool.  
* **Chart Type:** Line Chart (X-Axis: Time, Y-Axis: Juz Completed).  
* **Curve Style:** Smooth, non-linear curve (monotone or natural) reflecting the velocity phases—avoid jagged steps.  
* **X-Axis (Time) Formatting:**  
  * Primary labels: Display **month names only** (e.g., "Jan", "Feb", "Mar").  
  * Year indicators: When the year changes, display the **year underneath** the month label (e.g., "Jan" with "2027" below it).  
  * Ensure labels remain readable even when timeline spans multiple years.  
* **Y-Axis (Progress):** Display Juz milestones (0–30), with clear gridlines for reference.  
* **Break/Holiday Visualization:**  
  * Display breaks as **vertical indicators** (e.g., lines, bars, or zones) to minimize horizontal space usage.  
  * Avoid overlap and crowding—especially critical for multi-year timelines with many breaks.  
  * Consider techniques such as: stacking labels, using icons/abbreviations, or interactive tooltips to handle dense break periods.  
* **Multi-Year Optimization:**  
  * Ensure the design remains readable and uncluttered when timeline extends 2+ years.  
  * Adaptive spacing/scaling techniques are encouraged to prevent visual cramping.  
* **Interaction:**  
  * Hovering over the progress line shows the expected Juz number and date for that point.  
  * Hovering over break indicators shows break name and date range.

### **3.5 Component: VelocityTuner (Advanced Configuration)**

**Functional Requirements (FR):**

* **FR-12 Customizable Matrix:** Allow user to define the Juz allocation and learning pace (lines/day) of the three memorization phases.

**UI Specifications:**

* **Location:** Collapsible section or Modal labeled "Velocity Matrix".  
* **Controls:**  
  * **Phase 1: Warm-up**  
    * *Duration:* Slider/Input for number of Juz (Default: 3 Juz).  
    * *Intensity:* Slider/Input for lines per day (Default: 5 lines/day).  
  * **Phase 2: Flow State**  
    * *Duration:* Slider/Input for number of Juz (Default: 18 Juz).  
    * *Intensity:* Slider/Input for lines per day (Default: 10 lines/day).  
  * **Phase 3: Acceleration**  
    * *Duration:* Slider/Input for number of Juz (Default: 9 Juz).  
    * *Intensity:* Slider/Input for lines per day (Default: 15 lines/day).  
* **Validation:**  
  * Ensure total Juz across all phases sum to exactly 30.  
  * Ensure phase names remain semantically consistent with their intensity values (e.g., Warm-up should have lower lines/day than Acceleration).  
  * Ensure phases don't overlap in the timeline (sequential progression from Phase 1 → Phase 2 → Phase 3).

### **3.6 Component: HolidayManager (Break Configuration)**

**Functional Requirements (FR):**

* **FR-13 Custom Break Management:** Allow users to view, edit, add, and remove break periods (holidays/vacations) that pause the memorization timeline.
* **FR-14 Seasonal Holiday Import:** Option to import common seasonal/religious holidays automatically.

**UI Specifications:**

* **Location:** Collapsible section or Modal labeled "Break Configuration" or "Holiday Management".  
* **Default Breaks Display:** List view showing pre-configured breaks:  
  * **March Break:** March 10 – March 18  
  * **August Break:** August 20 – August 31  
  * **Winter Break:** December 20 – January 2  
* **Controls:**  
  * **Edit Break:** Click on any existing break to modify:  
    * *Name:* Text input (e.g., "March Break", "Family Vacation").  
    * *Start Date:* Date picker.  
    * *End Date:* Date picker.  
    * *Recurrence:* Dropdown/Toggle (Annual, One-time).  
  * **Add Custom Break:** Button to create new break periods with the same fields as above.  
  * **Delete Break:** Option to remove any break (including defaults).  
  * **Import Holidays:** Button/Toggle to auto-add common holidays:  
    * *Option 1:* Regional holidays (e.g., US, Canada, UK holidays).  
    * *Option 2:* Religious holidays (e.g., Ramadan, Eid, major Islamic dates).  
    * Display a checklist of available holidays to selectively import.  
* **Visual Feedback:**  
  * Show total number of off-days being applied to the timeline.  
  * Display how breaks affect the projected completion date (e.g., "+15 days added").  
* **Validation:**  
  * Ensure Start Date is before End Date.  
  * Warn if breaks overlap with each other.  
  * Highlight if a break extends beyond the projected completion date.

### **3.7 Logic Integration (Advanced Simulation)**

**Core Algorithm Updates:**

1. **Customizable Velocity Matrix:**  
   * The calculation must apply the user-defined matrix to the *Remaining Lines*.  
   * **Total Time Calculation:**  
     Total\_Days\_Needed \= Days\_in\_Warmup \+ Days\_in\_Flow \+ Days\_in\_Accel  
   * **Phase Calculation Logic:**  
     Phase\_Days \= (Total\_Remaining\_Lines \* Phase\_Duration\_Percentage) / (Base\_Daily\_Pace \* Phase\_Intensity\_Percentage)  
2. **Calendar Blackout Dates (Holidays):**  
   * The "Active Days" logic must strictly exclude specific date ranges annually:  
     * **March Break:** March 10 – March 18\.  
     * **August Break:** August 20 – August 31\.  
     * **Winter Break:** December 20 – January 2\.  
3. **Sick Day Buffer (Probabilistic Loss):**  
   * **Logic:** Subtract a flat **10 days** per year from the "Active Days" calculation (randomly distributed or averaged out as a capacity reduction factor of \~2.7%).  
4. **Buffer Display:**  
   * The displayed "Projected Date" must define the *end* of this calculated timeline, ensuring the holidays push the date forward rather than just being ignored.