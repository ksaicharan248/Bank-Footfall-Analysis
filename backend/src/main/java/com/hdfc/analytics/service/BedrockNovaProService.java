package com.hdfc.analytics.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.core.SdkBytes;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.bedrockruntime.BedrockRuntimeClient;
import software.amazon.awssdk.services.bedrockruntime.BedrockRuntimeClientBuilder;
import software.amazon.awssdk.services.bedrockruntime.model.InvokeModelRequest;
import software.amazon.awssdk.services.bedrockruntime.model.InvokeModelResponse;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Amazon Bedrock Nova Pro Integration Service
 * Handles AI responses using real MySQL data
 */
@Service
public class BedrockNovaProService {

    @Autowired
    private AnalyticsService analyticsService;

    private final BedrockRuntimeClient bedrockClient;
    private final ObjectMapper objectMapper;
    private final Dotenv dotenv;

    private static final String NOVA_PRO_MODEL_ID = "amazon.nova-pro-v1:0";

    public BedrockNovaProService() {
        // Load environment variables
        this.dotenv = Dotenv.configure()
                .directory("./")
                .ignoreIfMissing()
                .load();

        this.objectMapper = new ObjectMapper();

        // Configure AWS credentials and region from .env file
        String accessKey = dotenv.get("AWS_ACCESS_KEY_ID");
        String secretKey = dotenv.get("AWS_SECRET_ACCESS_KEY");
        String region = dotenv.get("AWS_REGION", "us-east-1");

        BedrockRuntimeClientBuilder clientBuilder = BedrockRuntimeClient.builder()
                .region(Region.of(region));

        // Use credentials from .env if available, otherwise fall back to default provider
        if (accessKey != null && secretKey != null && !accessKey.equals("your_aws_access_key_here")) {
            AwsBasicCredentials awsCreds = AwsBasicCredentials.create(accessKey, secretKey);
            clientBuilder.credentialsProvider(StaticCredentialsProvider.create(awsCreds));
            System.out.println("✅ Using AWS credentials from .env file");
        } else {
            clientBuilder.credentialsProvider(DefaultCredentialsProvider.create());
            System.out.println("⚠️ Using default AWS credentials provider (configure .env file for explicit credentials)");
        }

        this.bedrockClient = clientBuilder.build();
    }

    /**
     * Generate AI response using Nova Pro with real MySQL data
     */
    public String generateAIResponse(String userQuestion) {
        try {
            System.out.println("🤖 Nova Pro: Processing question - " + userQuestion);

            // Step 1: Fetch real-time data from MySQL
            String dataContext = fetchRealTimeDataContext();
            System.out.println("📊 Nova Pro: Data context prepared - " + dataContext.length() + " characters");

            // Step 2: Create enhanced prompt for Nova Pro
            String prompt = buildEnhancedPrompt(userQuestion, dataContext);
            System.out.println("📝 Nova Pro: Prompt created - " + prompt.length() + " characters");

            // Step 3: Call Amazon Bedrock Nova Pro
            String aiResponse = callNovaProModel(prompt);
            System.out.println("✅ Nova Pro: Response generated successfully");

            return aiResponse;

        } catch (Exception e) {
            System.err.println("❌ Nova Pro Error: " + e.getMessage());
            e.printStackTrace();
            return generateFallbackResponse(userQuestion, e.getMessage());
        }
    }

    /**
     * Fetch comprehensive real-time data from MySQL
     */
    private String fetchRealTimeDataContext() {
        StringBuilder context = new StringBuilder();

        try {
            // Get footfall data for the past 7 days
            java.time.LocalDate endDate = java.time.LocalDate.now();
            java.time.LocalDate startDate = endDate.minusDays(7);

            var footfallData = analyticsService.getFootfallTrendsWithPrediction(startDate, endDate);

            if (!footfallData.isEmpty()) {
                context.append("REAL-TIME FOOTFALL DATA (Past 7 Days):\\n");
                int totalFootfall = 0;
                int nyTotal = 0, dcTotal = 0, njTotal = 0;

                for (var day : footfallData) {
                    context.append(String.format("- %s: New York: %d, Washington DC: %d, New Jersey: %d, Total: %d\\n",
                            day.getDate(), day.getSiruseri(), day.getTnagar(), day.getNavalur(), day.getTotal()));

                    totalFootfall += day.getTotal();
                    nyTotal += day.getSiruseri();
                    dcTotal += day.getTnagar();
                    njTotal += day.getNavalur();
                }

                context.append(String.format("\\nTOTAL SUMMARY:\\n"));
                context.append(String.format("- Overall Total: %d visitors\\n", totalFootfall));
                context.append(String.format("- New York Total: %d visitors\\n", nyTotal));
                context.append(String.format("- Washington DC Total: %d visitors\\n", dcTotal));
                context.append(String.format("- New Jersey Total: %d visitors\\n", njTotal));
                context.append(String.format("- Average Daily: %.1f visitors\\n", totalFootfall / 7.0));
            }

            // Add more context (branch performance, etc.)
            context.append("\\nBANKING CONTEXT:\\n");
            context.append("- ABC Bank has 3 main branches\\n");
            context.append("- New York (IT Hub), Washington DC (Commercial), New Jersey (Residential)\\n");
            context.append("- Current date: ").append(java.time.LocalDate.now()).append("\\n");

        } catch (Exception e) {
            context.append("REAL-TIME DATA: Error fetching - ").append(e.getMessage());
        }

        return context.toString();
    }

    /**
     * Build enhanced prompt for Nova Pro with banking context
     */
    private String buildEnhancedPrompt(String userQuestion, String dataContext) {
        return String.format("""
            You are an intelligent AI banking assistant powered by Amazon Nova Pro, specialized in ABC Bank branch analytics.
            You have access to real-time MySQL database information and advanced analytical capabilities.

            REAL-TIME DATABASE CONTEXT:
            %s

            INSTRUCTIONS:
            1. Analyze the real MySQL data provided above
            2. Provide specific numbers and calculations from the actual data
            3. Use branch names: New York (instead of Siruseri), Washington DC (instead of T Nagar), New Jersey (instead of Navalur)
            4. Be professional, analytical, and data-driven
            5. Include insights, trends, and recommendations
            6. Maximum 200 words but be comprehensive

            USER QUESTION: "%s"

            Generate a professional, data-driven response using the real database information provided above.
            """, dataContext, userQuestion);
    }

    /**
     * Call Amazon Bedrock Nova Pro model
     */
    private String callNovaProModel(String prompt) throws Exception {
        System.out.println("🔄 Nova Pro: Calling Amazon Bedrock...");

        // Create request payload for Nova Pro
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("inputText", prompt);

        Map<String, Object> textConfig = new HashMap<>();
        textConfig.put("maxTokenCount", 500);
        textConfig.put("temperature", 0.7);
        textConfig.put("topP", 0.9);
        requestBody.put("textGenerationConfig", textConfig);

        String jsonBody = objectMapper.writeValueAsString(requestBody);
        System.out.println("📤 Nova Pro: Request payload size - " + jsonBody.length() + " characters");

        // Create Bedrock request
        InvokeModelRequest request = InvokeModelRequest.builder()
                .modelId(NOVA_PRO_MODEL_ID)
                .body(SdkBytes.fromUtf8String(jsonBody))
                .contentType("application/json")
                .accept("application/json")
                .build();

        System.out.println("🚀 Nova Pro: Invoking model " + NOVA_PRO_MODEL_ID);

        // Call Bedrock
        InvokeModelResponse response = bedrockClient.invokeModel(request);

        System.out.println("📥 Nova Pro: Response received from Bedrock");

        // Parse response
        String responseBody = response.body().asUtf8String();
        System.out.println("📄 Nova Pro: Response body size - " + responseBody.length() + " characters");

        JsonNode jsonResponse = objectMapper.readTree(responseBody);

        // Extract the generated text
        if (jsonResponse.has("results") && jsonResponse.get("results").isArray()) {
            JsonNode firstResult = jsonResponse.get("results").get(0);
            if (firstResult.has("outputText")) {
                String generatedText = firstResult.get("outputText").asText();
                System.out.println("✅ Nova Pro: Generated text extracted - " + generatedText.length() + " characters");
                return generatedText;
            }
        }

        System.err.println("❌ Nova Pro: Unexpected response format");
        System.err.println("Response body: " + responseBody);
        throw new Exception("Unexpected response format from Nova Pro");
    }

    /**
     * Generate fallback response when Bedrock fails
     */
    private String generateFallbackResponse(String userQuestion, String error) {
        return String.format("""
            🤖 **ABC Bank AI Assistant (Offline Mode)**

            I apologize, but I'm currently experiencing connectivity issues with the Amazon Nova Pro AI service.

            **Error**: %s

            **Fallback Response**: I'm still here to help! While I work to restore full AI capabilities,
            you can explore the dashboard for:

            📊 **Real-time Analytics**:
            • Footfall trends and predictions
            • Branch performance comparisons
            • Customer satisfaction metrics
            • Revenue tracking

            💡 **Your Question**: "%s"

            Please try again in a moment, or use the dashboard features directly.
            """, error, userQuestion);
    }
}
