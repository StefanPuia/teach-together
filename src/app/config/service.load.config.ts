import { ServiceStorage } from '../../framework/core/engine/service.engine';
import { CourseServices } from '../core/service-definition/course.services';

const ServiceLoad: ServiceStorage = {};

Object.assign(ServiceLoad, CourseServices);

export { ServiceLoad };
