import React, { useEffect, useState } from 'react'
import { Row, Col, Form, Button, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Pagination from 'react-bootstrap/Pagination'

export default function MyTable() {
  const [search, setSearch] = useState('')
  const [list, setList] = useState(JSON.parse(localStorage.getItem('list')) || [])
  const [filterList, setFilterList] = useState(list)

  useEffect(() => {
    setFilterList(list.filter((i) => {
      const filter = ['fid', 'fullName', 'object', 'dateOfBirth', 'gender', 'province']
      let add = false;
      for (const [key, v] of Object.entries(i)) {
        if (filter.includes(key) && v.toLowerCase().includes(search.toLowerCase())) {
          add = true;
          break;
        }
      }
      return add;
    }))
    setCurrentPage(1)
  }, [search, list])

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(2);
  const totalPages = Math.ceil(filterList.length / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);


  return (
    <>
      <Row className='pt-5 mb-4'>
        <Col lg={12}>
          <h1 className='fs-1 text-center'>
            Vietnam Health Declaration for foreign entry
          </h1>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col lg={4}>
          <Form action="">
            <Form.Group controlId="search">
              <Form.Label hidden></Form.Label>
              <Form.Control type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </Form.Group>
          </Form>
        </Col>
        <Col className='text-end'>
          <div className='d-flex justify-content-end'>
            <Button variant='success' size='md' as={Link} to='/declaration'>
              New form
            </Button>
          </div>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col lg={12}>
          <Table size='md' bordered hover>
            <thead>
              <tr className='table-success w-100'>
                <th className='text-center'>#</th>
                <th>Form ID</th>
                <th>Full Name</th>
                <th>Object</th>
                <th>Date of Birth</th>
                <th>Gender</th>
                <th>Contact Province</th>
              </tr>
            </thead>
            <tbody className='w-100'>
              {filterList.length > 0
                ? <>
                  {filterList
                    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                    .map((f, i) => (
                      <tr className="w-100" key={f.fid}>
                        <td className='text-center py-3'>
                          {i + 1}
                        </td>
                        <td className='d-flex gap-3 py-3'>
                          <Link to={`/edit/${f.fid}`}><i className="fa-solid fa-pen-to-square"></i></Link>
                          <Link className='text-danger' onClick={() => {
                            if (window.confirm(`Do you want to delete form with ID:${f.fid}`)) {
                              const newList = list.filter(form => form.fid !== f.fid)
                              localStorage.setItem('list', JSON.stringify(newList));
                              setList(newList)
                            }
                          }}><i className="fa-solid fa-trash-can"></i></Link>
                          {f.fid}
                        </td>
                        <td className="py-3 text-truncate info">
                          {f.fullName}
                        </td>
                        <td className="py-3 text-truncate info">
                          {f.object}
                        </td>
                        <td className="py-3 text-truncate info">
                          {f.dateOfBirth}
                        </td>
                        <td className="py-3 text-truncate info">
                          {f.gender}
                        </td>
                        <td className="py-3 text-truncate info">
                          {f.province}
                        </td>
                      </tr>
                    ))}
                </>
                : <>
                  <tr className='w-100'>
                    <td colSpan={7} className='border'>
                      <p className='fs-5 mb-0 text-center w-100'>No Declarations</p>
                    </td>
                  </tr>
                </>}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <div className='d-flex justify-content-center align-items-center gap-3'>
            <nav>
              <Pagination className="justify-content-end m-0">
                <Pagination.Item
                  onClick={() => setCurrentPage((oldPage) => Math.max(oldPage - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Pagination.Item>
                {pageNumbers.map((number) => (
                  <Pagination.Item
                    key={number}
                    onClick={() => setCurrentPage(number)}
                    active={currentPage === number}
                  >
                    {number}
                  </Pagination.Item>
                ))}
                <Pagination.Item
                  onClick={() => setCurrentPage((oldPage) => Math.min(oldPage + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Pagination.Item>
              </Pagination>
            </nav>
            <Form className="d-flex align-items-center justify-content-end">
              <Form.Select
                style={{ width: '5rem' }}
                value={itemsPerPage}
                onChange={(e) => {
                  setCurrentPage(1)
                  setItemsPerPage(e.target.value)
                }}
              >
                <option value="2">2</option>
                <option value="4">4</option>
                <option value="6">6</option>
              </Form.Select>
              <Form.Label className="mx-2">Items/Page</Form.Label>
            </Form>
          </div>
        </Col>
      </Row>
    </>
  )
}
