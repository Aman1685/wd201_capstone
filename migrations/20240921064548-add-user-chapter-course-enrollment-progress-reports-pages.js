/* eslint-disable no-unused-vars */
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
await queryInterface.addConstraint('Courses', {
  fields: ['educator_id'],
  type: 'foreign key',
  references: {
    table: 'Users',
    field: 'id',
  },
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

await queryInterface.addConstraint('Chapters', {
  fields: ['course_id'],
  type: 'foreign key',
  references: {
    table: 'Courses',
    field: 'id',
  },
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

await queryInterface.addConstraint('Pages', {
  fields: ['chapter_id'],
  type: 'foreign key',
  references: {
    table: 'Chapters',
    field: 'id',
  },
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

await queryInterface.addConstraint('Enrollments', {
  fields: ['user_id'],
  type: 'foreign key',
  name: 'FK_Enrollments_Users',
  references: {
    table: 'Users',
    field: 'id',
  },
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

await queryInterface.addConstraint('Enrollments', {
  fields: ['course_id'],
  type: 'foreign key',
  references: {
    table: 'Courses',
    field: 'id',
  },
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

await queryInterface.addConstraint('Progresses', {
  fields: ['user_id'],
  type: 'foreign key',
  references: {
    table: 'Users',
    field: 'id',
  },
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

await queryInterface.addConstraint('Progresses', {
  fields: ['page_id'],
  type: 'foreign key',
  references: {
    table: 'Pages',
    field: 'id',
  },
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

await queryInterface.addConstraint('Reports', {
  fields: ['course_id'],
  type: 'foreign key',
  references: {
    table: 'Courses',
    field: 'id',
  },
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

  },

  async down (queryInterface, Sequelize) {
  
  }
};
