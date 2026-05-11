#!/usr/bin/env python3
"""
Test script to verify fallback system works
"""
import os
import requests
import json

def test_fallback_system():
    """Test the fallback system by simulating API failure"""
    url = "http://localhost:8000/generate"
    
    # Test different domains to see fallback responses
    test_cases = [
        {"domain": "AI", "difficulty": "Intermediate", "purpose": "Academic", "output_type": "Full Project"},
        {"domain": "Web Development", "difficulty": "Beginner", "purpose": "Portfolio", "output_type": "Full Project"},
        {"domain": "IoT", "difficulty": "Advanced", "purpose": "Startup", "output_type": "Full Project"},
    ]
    
    print("🧪 Testing fallback system with different domains...")
    
    for i, payload in enumerate(test_cases, 1):
        print(f"\n📤 Test {i}: {payload['domain']}")
        
        try:
            response = requests.post(url, json=payload, timeout=30)
            print(f"📊 Status Code: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ SUCCESS! Generated project:")
                print(f"   Title: {data.get('title', 'N/A')}")
                print(f"   Domain: {data.get('domain', 'N/A')}")
                print(f"   Tech Stack: {', '.join(data.get('tech_stack', []))}")
                
                # Check if it has all required fields
                required_fields = ['title', 'domain', 'problem_statement', 'solution', 'tech_stack', 'abstract']
                missing_fields = [field for field in required_fields if field not in data]
                
                if missing_fields:
                    print(f"⚠️ Missing fields: {missing_fields}")
                else:
                    print("✅ All required fields present")
                    
            else:
                print(f"❌ FAILED! Response: {response.text}")
                
        except Exception as e:
            print(f"❌ ERROR: {str(e)}")

if __name__ == "__main__":
    test_fallback_system()