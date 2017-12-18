"""
Generate a fake dataset to simulate the type of data we'll use for the
DCU mapping project
"""
from __future__ import division

import os
import json
import string
import random

import numpy as np
import names

cities = {
'Belfast':{'lat':54.5973, 'lng':-5.9301, 'state':'Northern Ireland'},
'Derry':{'lat':54.9966, 'lng':-7.3086, 'state':'Northern Ireland'},
'Lisburn':{'lat':54.5162, 'lng':-6.0580, 'state':'Northern Ireland'},
'Dublin':{'lat':53.3498, 'lng':-6.2603, 'state':'Republic of Ireland'},
'Cork':{'lat':51.8969, 'lng':-8.4863, 'state':'Republic of Ireland'},
'Limerick':{'lat':52.6680, 'lng':-8.6305, 'state':'Republic of Ireland'},
'Galway':{'lat':53.2707, 'lng':-9.0568, 'state':'Republic of Ireland'},
'Waterford':{'lat':52.2594, 'lng':-7.1101, 'state':'Republic of Ireland'}
}

class Response():
    """
    class to simulate all of the values a responder may enter
    """

    def __init__(self, orgName='nameless'):
        # each attribute of the class will store the response for a different field
        self.orgName = orgName

        # contact info
        self.contact_name = names.get_full_name()       # grab a random name
        self.email = '{}@{}.com'.format(self.contact_name.split(' ')[0].lower(), self.orgName.lower())

        # location
        self.city = self.set_city()
        self.lat, self.lng = self.set_latLng(self.city)

        # organization info
        self.jurisdiction = self.set_jurisdiction(self.city)
        self.fundingSource = random.choice(['EU', 'Philanthropy', 'Government', 'Other'])


    def set_city(self):
        """ grab a random city from the cities dictionary """
        thisCity = random.choice(list(cities.keys()))
        return thisCity

    def set_latLng(self, city):
        """
        generate a fake lat/lng that is close to the specified city

        each degree of latitude is ~111 km; of longitude is ~85km

        We will randomly sample a location within a ~15km radius of the city
        center. So, lat = realLat +/- (15/111); and lng = realLng +/- (15/85)
        """
        realLat = cities[city]['lat']
        realLng = cities[city]['lng']

        latRange = 15/111
        lngRange = 15/85
        latOffset = -latRange + random.random()*2*latRange
        lngOffset = -lngRange + random.random()*2*lngRange

        thisLat = realLat + latOffset
        thisLng = realLng + lngOffset

        return thisLat, thisLng

    def set_jurisdiction(self, city):
        """ set the jurisdiction based on where the city is """
        state = cities[city]['state']
        if state == 'Northern Ireland':
            jurisdiction = random.choice(['Northern Ireland', 'Both'])
        elif state == 'Republic of Ireland':
            jurisdiction = random.choice(['Republic of Ireland', 'Both'])

        return jurisdiction


if __name__ == '__main__':

    # make a list to store each users's response
    allResponses = []

    for i in range(50):

        # generate a random org name
        this_orgName = ''.join(random.choices(string.ascii_uppercase + string.digits, k=3))

        thisResponse = Response(orgName=this_orgName)


        allResponses.append(thisResponse.__dict__)

    # write the responses to a json file
    with open('fakeData_large.json', 'w') as outputFile:
        json.dump(allResponses, outputFile, indent=3)
