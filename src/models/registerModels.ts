import mongoose from 'mongoose';
import './bloq.model';
import './locker.model';
import './rent.model';

// We are using this file mainly to make sure we have our models imported
// Directed at the e2e tests

// Loading to mongoose the models
export const LockerModel = mongoose.model('Locker');
export const BloqModel = mongoose.model('Bloq');
export const RentModel = mongoose.model('Rent');
