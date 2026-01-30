// Simple test script to validate chat function logic
import { handler } from './chat.ts';

async function testChatFunction() {
    console.log('🧪 Testing Netlify Chat Function...\n');

    // Test 1: Valid request
    console.log('Test 1: Valid chat message');
    const validEvent = {
        httpMethod: 'POST',
        path: '/chat',
        headers: { 'host': 'localhost', 'content-type': 'application/json' },
        body: JSON.stringify({ message: 'How do I memorize Quran effectively?' })
    };

    try {
        const response = await handler(validEvent, {});
        console.log('✅ Status:', response.statusCode);
        console.log('📦 Response:', response.body);
    } catch (error) {
        console.error('❌ Error:', error.message);
    }

    console.log('\n---\n');

    // Test 2: Missing message
    console.log('Test 2: Missing message (should return 400)');
    const invalidEvent = {
        httpMethod: 'POST',
        path: '/chat',
        headers: { 'host': 'localhost', 'content-type': 'application/json' },
        body: JSON.stringify({})
    };

    try {
        const response = await handler(invalidEvent, {});
        console.log('✅ Status:', response.statusCode);
        console.log('📦 Response:', response.body);
    } catch (error) {
        console.error('❌ Error:', error.message);
    }

    console.log('\n✨ Tests complete!');
}

testChatFunction();
