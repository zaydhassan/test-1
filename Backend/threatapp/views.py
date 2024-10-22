from django.shortcuts import render


# Create your views here.

import requests
from rest_framework.response import Response
from rest_framework.decorators import api_view 
from pymongo import MongoClient
from datetime import datetime, timedelta
from django.http import JsonResponse  # Import JsonResponse to return data in JSON format
import traceback, pytz

# MongoDB Connection
client = MongoClient('mongodb://localhost:27017/')  # Replace with your MongoDB connection string if necessary
db = client['threatdata']  # Database name
threat_data = db['threatapp_threat']  # Collection name


@api_view(['GET'])
def fetch_threat_data(request):
    
    # Get current date and time
    current_time = datetime.utcnow() - timedelta(days=1)  # Current UTC time (ISO format)
    past_time = current_time - timedelta(days=1)  # Two days ago
    print(current_time)
    
    # Convert to the format required by the API (e.g., "2024-09-20T10:22:57Z")
    date_end = current_time.strftime('%Y-%m-%dT%H:%M:%SZ')
    date_start =  past_time.strftime('%Y-%m-%dT%H:%M:%SZ')

    # cloudflare api and authentication details
    api_url ="https://api.cloudflare.com/client/v4/radar/attacks/layer7/top/locations/origin"
    headers = {
        "Content-Type": "application/json",
        "X-Auth-Email": "sanjaykmrcs@gmail.com",  
        "X-Auth-Key": "3ece1ffa9c008ba16d254282447802a81329d"
        }
    params = {
        'dateStart': date_start,
        'dateEnd': date_end
    }           
    
    
    try:
        
        #sending requests to Api(cloudflare)
        response = requests.get(api_url, headers=headers,params=params)
        response.raise_for_status()
        data = response.json()
        #print(data)
        
    except Exception as e:
        print(f"Error: {e}\nTraceback: {traceback.format_exc()}")
        return Response({"error": str(e)}, status=400)
        
        
        
        
    if data.get("success", False):
        top_attacked = data["result"]["top_0"]
        countryattacked_to_insert = []
            
            
        if not top_attacked:
            return Response({"error": "No threat data found in the API response"}, status=400)
        
        for country in top_attacked:
            print(country)
            country_data = {
                'origin_country_alpha2': country['originCountryAlpha2'],
                'origin_country_name': country['originCountryName'],
                'value': country['value'],
                'rank': country['rank'],
                'date' : current_time,
            }
            print(country_data)
            
             # Check if the record already exists based on 'origin_country_alpha2'
            existing_record = threat_data.find_one({'origin_country_alpha2': country['originCountryAlpha2']})
            if not existing_record:
                countryattacked_to_insert.append(country_data)
            else:
                # If the record exists, update it with the new data
                threat_data.update_one(
                    {'origin_country_alpha2': country['originCountryAlpha2']},
                    {'$set': country_data}
                )
                
        if countryattacked_to_insert:
            threat_data.insert_many(countryattacked_to_insert)
            return Response({"message": "Data successfully inserted into MongoDB."}, status=200)
        
        else:
            return Response({"message": "No new data to insert into MongoDB."}, status=200)



# View to render the data on the web page
def display_threat_data(request):
    # Fetch the data from MongoDB collection
    data_from_db = list(threat_data.find({}, {'_id': 0}).sort([('date',-1),('rank',1)]).limit(5))  # Exclude the '_id' field from display
    
    # Pass the data to the template
    #return render(request, 'threatapp/threat_display.html', {'threats': data_from_db})
    # Return the data as JSON
    return JsonResponse(data_from_db, safe=False)