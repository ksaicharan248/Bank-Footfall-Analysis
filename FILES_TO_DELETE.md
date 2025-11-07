# 🗑️ Files to Delete - Project Cleanup

## Unnecessary Files & Folders

### 1. Duplicate/Redundant Files
```
❌ DELETE THESE:
├── test/enhanced_bedrock_fastapi.py          # Duplicate of LLM/enhanced_bedrock_fastapi.py
├── testt.java                                # Test file, not needed
├── HdfcDataGeneratorSprint3.java            # Old generator, replaced by SQL scripts
├── HdfcDataGeneratorSprint3.class           # Compiled Java class
├── HdfcDataGeneratorSprint3$1.class         # Inner class files
├── HdfcDataGeneratorSprint3$Branch.class    # Inner class files
├── HdfcDataGeneratorSprint3$ServiceType.class # Inner class files
├── run_sprint3_generator.bat                 # Old batch file
```

### 2. Old SQL Files (Keep only latest)
```
❌ DELETE THESE OLD SQL FILES:
├── sprint1_historical_part1.sql
├── sprint1_part1.sql
├── sprint1_part2.sql
├── sprint1_pilot_data.sql
├── sprint1_september_data.sql
├── sprint2_corrected_part1.sql
├── sprint2_corrected_part2.sql
├── sprint2_corrected_part3.sql
├── sprint2_enhanced_data.sql
├── sprint2_part2_enhanced_data.sql
├── sprint3_data_generation.sql
├── sprint3_extended_data_gen.sql
├── sprint3_final_data_gen.sql
├── sprint3_massive_data_gen.sql
├── sprint3_simple_data_gen.sql
├── massive_volume_generator.sql
├── massive_volume_fixed.sql
├── test_calculation_fix.sql

✅ KEEP ONLY:
├── sql/schema/schema.sql                     # Main schema
├── sql/data/all_sprints_combined.sql         # Final data
```

### 3. Redundant Documentation
```
❌ DELETE THESE OLD DOCS:
├── Redme/ (entire folder)                    # Old readme files
├── docs/guides/ (most files)                # Keep only essential guides
├── docs/reports/ (old sprint reports)       # Archive or delete
├── SPRINT_1_COMPLETION_REPORT.md            # Root level duplicates
├── SPRINT_2_COMPLETION_REPORT.md
├── SPRINT_3_COMPLETION_REPORT.md
├── Stage2_Completion_Report.md
├── Stage3_Completion_Report.md
```

### 4. Test/Debug Files
```
❌ DELETE THESE:
├── nova-ai-demo.ps1
├── simple-ai-test.ps1
├── test-bedrock-setup.ps1
├── test-chatbot-ai.ps1
├── test-nova-backend.ps1
├── test-nova-pro.ps1
├── start_enhanced_llm_service.bat
├── frontend/nova-pro-test.html
├── frontend/chatbot-debug.html
├── frontend/test-api.html
├── frontend/public/api-test.html
├── frontend/public/chatbot-test.html
```

### 5. Temporary Files
```
❌ DELETE THESE:
├── temp/ (entire folder)                     # Temporary files
├── logs/ (root level - keep backend/logs/)   # Duplicate logs
├── detailed_analysis.sql                     # Root level duplicate
├── fetch_dashboard_metrics.sql               # Root level duplicate
├── live_dashboard_calculation.sql            # Root level duplicate
├── simple_dashboard_calc.sql                 # Root level duplicate
```

### 6. Package Files
```
❌ DELETE THESE:
├── temp/package-lock.json                    # Duplicate
├── temp/package.json                         # Duplicate
```

## Files to Keep (Essential)

### ✅ Core Application Files
```
├── backend/                                  # Spring Boot application
├── frontend/                                 # React application
├── LLM/enhanced_bedrock_fastapi.py          # AI service
├── sql/schema/schema.sql                     # Database schema
├── sql/data/all_sprints_combined.sql        # Sample data
├── scripts/                                  # Utility scripts
```

### ✅ Essential Documentation
```
├── README.md                                 # Main readme (to be created)
├── API_TESTING_GUIDE.md
├── AWS_CREDENTIALS_SETUP.md
├── CHATBOT_README.md
├── ENHANCED_LLM_IMPLEMENTATION_GUIDE.md
├── NOVA_PRO_SETUP_GUIDE.md
```

## Cleanup Commands

### Windows Commands:
```cmd
# Delete old SQL files
del sprint*.sql
del massive_volume*.sql
del test_calculation_fix.sql

# Delete Java class files
del *.class

# Delete PowerShell test files
del *.ps1

# Delete temp folder
rmdir /s temp

# Delete old documentation
rmdir /s Redme
```

### Summary
- **Delete**: ~50+ unnecessary files
- **Keep**: ~20 essential files
- **Space Saved**: ~500MB+ (including logs and temp files)
- **Result**: Clean, maintainable project structure