// Code generated by mockery v2.19.0. DO NOT EDIT.

package mocks

import (
	models "github.com/FR0ST1N/MyDailies/api/models"
	mock "github.com/stretchr/testify/mock"

	time "time"
)

// IEntryRepository is an autogenerated mock type for the IEntryRepository type
type IEntryRepository struct {
	mock.Mock
}

// Check provides a mock function with given fields: e
func (_m *IEntryRepository) Check(e *models.Entry) error {
	ret := _m.Called(e)

	var r0 error
	if rf, ok := ret.Get(0).(func(*models.Entry) error); ok {
		r0 = rf(e)
	} else {
		r0 = ret.Error(0)
	}

	return r0
}

// Create provides a mock function with given fields: e
func (_m *IEntryRepository) Create(e *models.Entry) error {
	ret := _m.Called(e)

	var r0 error
	if rf, ok := ret.Get(0).(func(*models.Entry) error); ok {
		r0 = rf(e)
	} else {
		r0 = ret.Error(0)
	}

	return r0
}

// ReadBetween provides a mock function with given fields: hid, start, end
func (_m *IEntryRepository) ReadBetween(hid uint, start time.Time, end time.Time) (*[]models.Entry, error) {
	ret := _m.Called(hid, start, end)

	var r0 *[]models.Entry
	if rf, ok := ret.Get(0).(func(uint, time.Time, time.Time) *[]models.Entry); ok {
		r0 = rf(hid, start, end)
	} else {
		if ret.Get(0) != nil {
			r0 = ret.Get(0).(*[]models.Entry)
		}
	}

	var r1 error
	if rf, ok := ret.Get(1).(func(uint, time.Time, time.Time) error); ok {
		r1 = rf(hid, start, end)
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}

type mockConstructorTestingTNewIEntryRepository interface {
	mock.TestingT
	Cleanup(func())
}

// NewIEntryRepository creates a new instance of IEntryRepository. It also registers a testing interface on the mock and a cleanup function to assert the mocks expectations.
func NewIEntryRepository(t mockConstructorTestingTNewIEntryRepository) *IEntryRepository {
	mock := &IEntryRepository{}
	mock.Mock.Test(t)

	t.Cleanup(func() { mock.AssertExpectations(t) })

	return mock
}
